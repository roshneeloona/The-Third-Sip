const path = require("path");

const ROOT_DIR = __dirname ? path.resolve(__dirname, "..") : process.cwd();
const ENV_FILE = path.join(ROOT_DIR, ".env");

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(ENV_FILE);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "thirdsip_secret_key";
const SESSION_SECRET = process.env.SESSION_SECRET || "thirdsip_session_secret";
const TOKEN_COOKIE_NAME = "thirdsip_token";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/thirdsip";

const DATA_DIR = path.join(ROOT_DIR, "data");
const STATIC_DIR = path.join(ROOT_DIR, "public");
const RECEIPTS_DIR = path.join(ROOT_DIR, "receipts");

const USERS_FILE = path.join(ROOT_DIR, "users.json");
const INVENTORY_FILE = path.join(DATA_DIR, "inventory.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const MENU_META_FILE = path.join(DATA_DIR, "menu-meta.json");
const ADMIN_SESSION_FILE = path.join(DATA_DIR, "admin-session.json");
const CONTACT_MESSAGES_FILE = path.join(DATA_DIR, "contact-messages.json");

module.exports = {
  PORT,
  JWT_SECRET,
  SESSION_SECRET,
  TOKEN_COOKIE_NAME,
  MONGODB_URI,
  DATA_DIR,
  STATIC_DIR,
  RECEIPTS_DIR,
  USERS_FILE,
  INVENTORY_FILE,
  ORDERS_FILE,
  MENU_META_FILE,
  ADMIN_SESSION_FILE,
  CONTACT_MESSAGES_FILE,
};
