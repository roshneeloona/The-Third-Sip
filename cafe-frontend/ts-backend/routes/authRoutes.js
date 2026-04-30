const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET, TOKEN_COOKIE_NAME } = require("../config/constants");
const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");
const { authenticateUser, requireAdmin } = require("../middleware/auth");
const { parseCookies } = require("../utils/cookies");
const { createAdminSession, releaseAdminSession, touchAdminSession } = require("../services/adminSessionService");
const {
  createUser,
  findUserByEmail: findUserByEmailInStore,
  getNextUserId,
  listUsers,
  normalizeEmail,
} = require("../services/userRepository");

const router = express.Router();

function createAuthPayload(user, extra = {}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "customer",
    ...extra,
  };
}

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthState(req, res, user, extra = {}) {
  const authPayload = createAuthPayload(user, extra);
  const token = signToken(authPayload);

  if (req.session) {
    req.session.user = authPayload;
  }

  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return { user: createAuthPayload(user) };
}

async function findUserByEmail(email) {
  return findUserByEmailInStore(email);
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new HttpError(400, "All fields are required");
    }

    if (String(password).length < 6) {
      throw new HttpError(400, "Password must be at least 6 characters");
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new HttpError(400, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      id: await getNextUserId(),
      name: String(name).trim(),
      email: normalizeEmail(email),
      password: hashedPassword,
      role: "customer",
      createdAt: new Date(),
    });

    const authState = setAuthState(req, res, user);
    res.status(201).json(authState);
  })
);

async function handleLogin(req, res, expectedRole) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new HttpError(400, "Email and password are required");
  }

  const user = await findUserByEmail(email);
  if (!user) {
    throw new HttpError(400, "Invalid email or password");
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw new HttpError(400, "Invalid email or password");
  }

  if (expectedRole && user.role !== expectedRole) {
    const message =
      expectedRole === "admin"
        ? "This account does not have staff access"
        : "This account is not a customer account. Please use the staff portal.";

    throw new HttpError(403, message);
  }

  let adminSessionId = null;
  if (user.role === "admin") {
    const lockResult = await createAdminSession(user, req.headers["user-agent"]);
    if (lockResult.blocked) {
      throw new HttpError(409, "Admin panel is already active in another browser. Please close it there or wait a minute.");
    }
    adminSessionId = lockResult.session.sessionId;
  }

  const authState = setAuthState(req, res, user, adminSessionId ? { adminSessionId } : {});
  res.json(authState);
}

function readAuthPayloadFromRequest(req) {
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (headerToken) {
    try {
      return jwt.verify(headerToken, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  if (req.session?.user) {
    return req.session.user;
  }

  const cookies = parseCookies(req.headers.cookie || "");
  const cookieToken = cookies[TOKEN_COOKIE_NAME];
  const token = cookieToken;

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    await handleLogin(req, res, "customer");
  })
);

router.post(
  "/admin-login",
  asyncHandler(async (req, res) => {
    await handleLogin(req, res, "admin");
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const authPayload = readAuthPayloadFromRequest(req);
    if (authPayload?.role === "admin" && authPayload.adminSessionId) {
      await releaseAdminSession(authPayload.adminSessionId);
    }

    res.clearCookie(TOKEN_COOKIE_NAME);
    if (req.session) {
      req.session.destroy(() => {
        res.json({ message: "Logged out successfully" });
      });
      return;
    }
    res.json({ message: "Logged out successfully" });
  })
);

router.post(
  "/admin-heartbeat",
  authenticateUser,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const sessionState = await touchAdminSession(req.user.adminSessionId);
    if (!sessionState) {
      throw new HttpError(409, "Admin panel is already active in another browser or this session expired");
    }

    res.json({
      message: "Admin session is active",
      expiresAt: sessionState.expiresAt,
      requestId: crypto.randomUUID(),
    });
  })
);

router.get(
  "/me",
  authenticateUser,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user });
  })
);

router.get(
  "/admin/users",
  authenticateUser,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const users = await listUsers();
    res.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "customer",
        createdAt: user.createdAt || null,
      })),
    });
  })
);

module.exports = router;
