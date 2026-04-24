const User = require("../models/User");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function toPlainUser(user) {
  if (!user) {
    return null;
  }

  if (typeof user.toObject === "function") {
    return user.toObject();
  }

  return user;
}

async function findUserById(id) {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    return null;
  }

  return User.findOne({ id: numericId }).lean();
}

async function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    return null;
  }

  return User.findOne({ email: normalizedEmail }).lean();
}

async function getNextUserId() {
  const latestUser = await User.findOne({}, { id: 1 }).sort({ id: -1 }).lean();
  return Number(latestUser?.id || 0) + 1;
}

async function createUser(userData) {
  const user = await User.create({
    ...userData,
    email: normalizeEmail(userData.email),
  });

  return toPlainUser(user);
}

async function listUsers() {
  return User.find({}, { _id: 0 }).sort({ id: 1 }).lean();
}

async function countUsers() {
  return User.countDocuments();
}

module.exports = {
  createUser,
  countUsers,
  findUserByEmail,
  findUserById,
  getNextUserId,
  listUsers,
  normalizeEmail,
};
