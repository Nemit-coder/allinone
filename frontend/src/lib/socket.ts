import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./api";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io((import.meta as any).env.VITE_API_URL, {
      auth: { token: getAccessToken() },
      autoConnect: false,
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Update auth token on reconnect attempts
    socket.on("reconnect_attempt", () => {
      socket!.auth = { token: getAccessToken() };
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
};

// Only call this on actual logout, not on page/tab change
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};