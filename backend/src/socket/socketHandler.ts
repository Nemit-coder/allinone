import type { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.ts";
import Message from "../models/message.model.ts";
import Conversation from "../models/conversation.model.ts";

// userId → socketId map (in-memory, fine for single server)
const onlineUsers = new Map<string, string>();

interface DecodedToken {
  id: string;
}

// Extend Socket type to carry userId
interface AuthSocket extends Socket {
  userId?: string;
}

export const initSocket = (io: Server) => {

  // ── JWT Auth Middleware ─────────────────────────────────────
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth?.token as string;
    if (!token) return next(new Error("No token"));

    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET as string) as DecodedToken;
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  // ── On Connection ───────────────────────────────────────────
  io.on("connection", async (socket: AuthSocket) => {
    const userId = socket.userId!;

    // Register online
    onlineUsers.set(userId, socket.id);

    // Tell everyone this user is online
    socket.broadcast.emit("user:online", { userId });

    // Auto-join all existing conversation rooms
    const conversations = await Conversation.find({ members: userId });
    conversations.forEach((c) => socket.join(c._id.toString()));

    console.log(`✅ Socket connected: userId=${userId}, socketId=${socket.id}, conversations=${conversations.length}`);

    // ── Send Message ──────────────────────────────────────────
    socket.on("message:send", async (data: { conversationId: string; text: string }) => {
      try {
        const { conversationId, text } = data;
        if (!text?.trim()) return;

        // Verify user is member of this conversation
        const conversation = await Conversation.findOne({
          _id: conversationId,
          members: userId,
        });
        if (!conversation) return socket.emit("error", { message: "Not a member" });

        // Save to DB
        const message = await Message.create({
          conversationId,
          sender: userId,
          text: text.trim(),
          readBy: [userId],
        });

        await message.populate("sender", "userName avatar");

        // Update conversation's lastMessage + updatedAt (for sorting)
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: new Date(),
        });

        // Emit to everyone in the room (sender gets confirmation too)
        io.to(conversationId).emit("message:receive", message);
      } catch (err) {
        console.error("Error sending message:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // ── Join Room (when user opens a chat) ────────────────────
    socket.on("conversation:join", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // ── Leave Room (when user navigates away from chat) ───────
    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(conversationId);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // ── Typing Indicators ─────────────────────────────────────
    socket.on("typing:start", ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit("typing:start", { userId, conversationId });
    });

    socket.on("typing:stop", ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit("typing:stop", { userId, conversationId });
    });

    // ── Read Receipts ─────────────────────────────────────────
    socket.on("message:read", async ({ conversationId }: { conversationId: string }) => {
      await Message.updateMany(
        { conversationId, readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } }
      );
      socket.to(conversationId).emit("message:read", { userId, conversationId });
    });

    // ── Disconnect ────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      socket.broadcast.emit("user:offline", { userId });
      console.log(`❌ Socket disconnected: userId=${userId}`);
    });
  });
};

// Export so routes can check online status if needed
export { onlineUsers };