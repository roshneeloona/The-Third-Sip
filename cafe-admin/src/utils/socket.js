import { io } from "socket.io-client";
import { API_BASE_URL, getAdminToken } from "./api";

export function createAdminSocket() {
  return io(API_BASE_URL, {
    transports: ["websocket"],
    auth: {
      token: getAdminToken(),
    },
  });
}
