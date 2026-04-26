const { CONTACT_MESSAGES_FILE } = require("../config/constants");
const { readJsonFile, writeJsonFile } = require("./jsonStore");
const { HttpError } = require("../utils/httpError");

const VALID_TOPICS = new Set(["Order help", "Ingredients", "Cafe visit", "General feedback"]);

function cleanText(value) {
  return String(value || "").trim();
}

function normalizeMessage(payload) {
  const name = cleanText(payload.name);
  const email = cleanText(payload.email).toLowerCase();
  const topic = VALID_TOPICS.has(payload.topic) ? payload.topic : "General feedback";
  const message = cleanText(payload.message);

  if (!name || !email || !message) {
    throw new HttpError(400, "Name, email, and message are required.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "Please enter a valid email address.");
  }

  if (message.length > 1200) {
    throw new HttpError(400, "Message should be 1200 characters or less.");
  }

  return {
    id: `MSG-${Date.now()}`,
    name,
    email,
    topic,
    message,
    status: "new",
    createdAt: new Date().toISOString(),
  };
}

async function createContactMessage(payload) {
  const nextMessage = normalizeMessage(payload || {});
  const messages = await readJsonFile(CONTACT_MESSAGES_FILE, []);
  const nextMessages = [nextMessage, ...messages];
  await writeJsonFile(CONTACT_MESSAGES_FILE, nextMessages);
  return nextMessage;
}

async function getContactMessages() {
  return readJsonFile(CONTACT_MESSAGES_FILE, []);
}

module.exports = {
  createContactMessage,
  getContactMessages,
};
