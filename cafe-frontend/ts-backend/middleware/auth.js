const jwt = require("jsonwebtoken");
const { JWT_SECRET, TOKEN_COOKIE_NAME } = require("../config/constants");
const { parseCookies } = require("../utils/cookies");
const { HttpError } = require("../utils/httpError");
const { touchAdminSession } = require("../services/adminSessionService");
const { findUserById } = require("../services/userRepository");

function getHeaderToken(req) {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
}

function getCookieToken(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  return cookies[TOKEN_COOKIE_NAME] || "";
}

async function buildRequestUser(user, adminSessionId, next) {
  const role = user.role || "customer";

  if (role === "admin") {
    const activeAdminSession = await touchAdminSession(adminSessionId);
    if (!activeAdminSession) {
      next(new HttpError(409, "Admin panel is already active in another browser or this session expired"));
      return null;
    }
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    adminSessionId,
  };
}

function attachSessionMeta(req, res, next) {
  if (req.session) {
    req.session.requestCount = (req.session.requestCount || 0) + 1;
    req.session.lastSeenAt = new Date().toISOString();
  }
  next();
}

async function authenticateUser(req, res, next) {
  try {
    const headerToken = getHeaderToken(req);
    if (headerToken) {
      const payload = jwt.verify(headerToken, JWT_SECRET);
      const user = await findUserById(payload.id);

      if (!user) {
        next(new HttpError(401, "User no longer exists"));
        return;
      }

      const requestUser = await buildRequestUser(user, payload.adminSessionId || null, next);
      if (!requestUser) {
        return;
      }

      req.user = requestUser;
      next();
      return;
    }

    if (req.session?.user?.id) {
      const sessionUser = await findUserById(req.session.user.id);
      if (sessionUser) {
        const requestUser = await buildRequestUser(
          sessionUser,
          req.session.user.adminSessionId || null,
          next
        );
        if (!requestUser) {
          return;
        }

        req.user = requestUser;
        next();
        return;
      }
    }

    const cookieToken = getCookieToken(req);
    if (!cookieToken) {
      next(new HttpError(401, "Authentication required"));
      return;
    }

    const payload = jwt.verify(cookieToken, JWT_SECRET);
    const user = await findUserById(payload.id);

    if (!user) {
      next(new HttpError(401, "User no longer exists"));
      return;
    }

    const requestUser = await buildRequestUser(user, payload.adminSessionId || null, next);
    if (!requestUser) {
      return;
    }

    req.user = requestUser;
    next();
  } catch (error) {
    next(new HttpError(401, "Invalid or expired authentication"));
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    next(new HttpError(403, "Admin access required"));
    return;
  }
  next();
}

module.exports = {
  attachSessionMeta,
  authenticateUser,
  requireAdmin,
};
