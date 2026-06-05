import type { Request, Response } from "express";
import Conversation from "../models/conversation.model.ts";
import Message from "../models/message.model.ts";

// GET or CREATE 1-on-1 conversation
export const getOrCreateConversation = async (req: Request, res: Response) => {
  try {
    const myId = req.user!.id;
    const { receiverId } = req.body;

    if (!receiverId) return res.status(400).json({ message: "receiverId required" });
    if (receiverId === myId) return res.status(400).json({ message: "Cannot chat with yourself" });

    // Find existing conversation between these two users
    let conversation = await Conversation.findOne({
      members: { $all: [myId, receiverId], $size: 2 },
    })
      .populate("members", "userName avatar")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "userName" } });

    if (!conversation) {
      conversation = await Conversation.create({ members: [myId, receiverId] });
      await conversation.populate("members", "userName avatar");
    }

    res.json({ success: true, conversation });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET all conversations for logged-in user
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    const myId = req.user!.id;

    const conversations = await Conversation.find({ members: myId })
      .populate("members", "userName avatar")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "userName" } })
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET messages for a conversation (paginated)
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 30;

    const messages = await Message.find({ conversationId: conversationId })
      .populate("sender", "userName avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};