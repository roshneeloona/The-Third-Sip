const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const {
  PORT,
  SESSION_SECRET,
  STATIC_DIR,
  RECEIPTS_DIR,
  INVENTORY_FILE,
  ORDERS_FILE,
  MENU_META_FILE,
  ADMIN_SESSION_FILE,
  CONTACT_MESSAGES_FILE,
} = require("./config/constants");
const { requestLogger } = require("./middleware/requestLogger");
const { attachSessionMeta } = require("./middleware/auth");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandlers");
const { ensureDirectory, ensureJsonFile } = require("./services/jsonStore");
const { DEFAULT_INVENTORY, DEFAULT_MENU_META, DEFAULT_ORDERS } = require("./services/seedData");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { initializeSocketServer } = require("./services/socketService");
const { connectToDatabase } = require("./services/database");
const { migrateLegacyUsers } = require("./services/userMigrationService");

const app = express();
const server = http.createServer(app);

initializeSocketServer(server);

function allowLocalhostOrigins(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }

  const isAllowed =
    /^http:\/\/localhost:\d+$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

  callback(isAllowed ? null : new Error("Origin not allowed"), isAllowed);
}

async function bootstrapStorage() {
  await ensureDirectory(STATIC_DIR);
  await ensureDirectory(RECEIPTS_DIR);
  await ensureJsonFile(INVENTORY_FILE, DEFAULT_INVENTORY);
  await ensureJsonFile(ORDERS_FILE, DEFAULT_ORDERS);
  await ensureJsonFile(MENU_META_FILE, DEFAULT_MENU_META);
  await ensureJsonFile(CONTACT_MESSAGES_FILE, []);
  await ensureJsonFile(ADMIN_SESSION_FILE, {
    active: false,
    sessionId: null,
    userId: null,
    name: "",
    email: "",
    userAgent: "",
    lastSeenAt: null,
    expiresAt: null,
  });
}

function configureApp() {
  app.use(
    cors({
      origin: allowLocalhostOrigins,
      credentials: true,
    })
  );
  app.use(requestLogger);
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );
  app.use(attachSessionMeta);

  app.use("/static", express.static(STATIC_DIR));
  app.get("/", (req, res) => {
    res.sendFile(path.join(STATIC_DIR, "status.html"));
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/menu", menuRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/inventory", inventoryRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/contact", contactRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);
}

async function start() {
  await bootstrapStorage();
  await connectToDatabase();
  const userMigration = await migrateLegacyUsers();
  configureApp();

  if (userMigration.migrated) {
    console.log(`Migrated ${userMigration.migratedCount} users from users.json into MongoDB.`);
  } else if (userMigration.seededDefaultAdmin) {
    console.log("Seeded the default admin user into MongoDB.");
  }

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PORT, () => {
      server.off("error", reject);
      resolve();
    });
  });

  console.log(`Server running on http://localhost:${PORT}`);
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
