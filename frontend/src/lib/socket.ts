import { io, Socket } from "socket.io-client";
import { getAccessToken } from "./api";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io((import.meta as any).env.VITE_API_BASE_URL || "http://localhost:3000", {
      auth: { token: getAccessToken() },
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};