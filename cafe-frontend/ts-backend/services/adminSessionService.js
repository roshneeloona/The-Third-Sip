const crypto = require("crypto");
const { ADMIN_SESSION_FILE } = require("../config/constants");
const { readJsonFile, writeJsonFile } = require("./jsonStore");

const ADMIN_SESSION_TTL_MS = 60 * 1000;

function emptySession() {
  return {
    active: false,
    sessionId: null,
    userId: null,
    name: "",
    email: "",
    userAgent: "",
    lastSeenAt: null,
    expiresAt: null,
  };
}

function isActiveSession(session) {
  if (!session?.active || !session?.sessionId || !session?.expiresAt) {
    return false;
  }

  return new Date(session.expiresAt).getTime() > Date.now();
}

function extendSessionWindow() {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ADMIN_SESSION_TTL_MS);
  return {
    lastSeenAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

async function readAdminSession() {
  const session = await readJsonFile(ADMIN_SESSION_FILE, emptySession());

  if (!isActiveSession(session)) {
    if (session?.active) {
      await writeJsonFile(ADMIN_SESSION_FILE, emptySession());
    }
    return emptySession();
  }

  return session;
}

async function getActiveAdminSession() {
  const session = await readAdminSession();
  return isActiveSession(session) ? session : null;
}

async function createAdminSession(user, userAgent = "") {
  const activeSession = await getActiveAdminSession();
  if (activeSession) {
    return { blocked: true, session: activeSession };
  }

  const sessionId = crypto.randomUUID();
  const windowData = extendSessionWindow();
  const session = {
    active: true,
    sessionId,
    userId: user.id,
    name: user.name,
    email: user.email,
    userAgent: String(userAgent || ""),
    ...windowData,
  };

  await writeJsonFile(ADMIN_SESSION_FILE, session);
  return { blocked: false, session };
}

async function touchAdminSession(sessionId) {
  if (!sessionId) {
    return null;
  }

  const current = await readAdminSession();
  if (!isActiveSession(current) || current.sessionId !== sessionId) {
    return null;
  }

  const next = {
    ...current,
    ...extendSessionWindow(),
  };

  await writeJsonFile(ADMIN_SESSION_FILE, next);
  return next;
}

async function releaseAdminSession(sessionId) {
  if (!sessionId) {
    return false;
  }

  const current = await readJsonFile(ADMIN_SESSION_FILE, emptySession());
  if (current.sessionId !== sessionId) {
    return false;
  }

  await writeJsonFile(ADMIN_SESSION_FILE, emptySession());
  return true;
}

module.exports = {
  ADMIN_SESSION_TTL_MS,
  createAdminSession,
  getActiveAdminSession,
  releaseAdminSession,
  touchAdminSession,
};
