const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/constants");

let io;

function initializeSocketServer(server) {
  io = new Server(server, {
    cors: {
      origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        next(new Error("Authentication required"));
        return;
      }

      const user = jwt.verify(token, JWT_SECRET);
      if (user.role !== "admin") {
        next(new Error("Admin access required"));
        return;
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid socket authentication"));
    }
  });

  io.on("connection", (socket) => {
    socket.join("admins");
    socket.emit("socket:ready", { message: "Live admin updates connected." });
  });

  return io;
}

function emitAdmin(eventName, payload) {
  if (!io) {
    return;
  }
  io.to("admins").emit(eventName, payload);
}

module.exports = {
  initializeSocketServer,
  emitAdmin,
};
