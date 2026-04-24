const fs = require("fs/promises");
const { USERS_FILE } = require("../config/constants");
const { createUser, countUsers } = require("./userRepository");

const DEFAULT_ADMIN_USER = {
  id: 1,
  name: "Third Sip Admin",
  email: "admin@thirdsip.com",
  password: "$2a$10$ltp6CV3Sm9hZx//nOfHSt.5sPXzZMSC.5yD.cne2zDixIh4OrIboq",
  role: "admin",
  createdAt: "2026-04-10T09:00:00.000Z",
};

async function readLegacyUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, "utf-8");
    if (!raw.trim()) {
      return [];
    }

    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

function normalizeLegacyUser(user) {
  return {
    id: Number(user.id),
    name: String(user.name || "").trim(),
    email: String(user.email || "").trim().toLowerCase(),
    password: String(user.password || ""),
    role: user.role === "admin" ? "admin" : "customer",
    createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
  };
}

async function migrateLegacyUsers() {
  const existingUsers = await countUsers();
  if (existingUsers > 0) {
    return { migrated: false, migratedCount: 0, seededDefaultAdmin: false };
  }

  const legacyUsers = await readLegacyUsers();
  if (legacyUsers.length === 0) {
    await createUser({
      ...DEFAULT_ADMIN_USER,
      createdAt: new Date(DEFAULT_ADMIN_USER.createdAt),
    });

    return { migrated: false, migratedCount: 0, seededDefaultAdmin: true };
  }

  for (const legacyUser of legacyUsers) {
    await createUser(normalizeLegacyUser(legacyUser));
  }

  return {
    migrated: true,
    migratedCount: legacyUsers.length,
    seededDefaultAdmin: false,
  };
}

module.exports = {
  migrateLegacyUsers,
};
