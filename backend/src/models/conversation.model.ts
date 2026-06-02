import mongoose from "mongoose";
import type { IConversation } from "../types/conversation.type";

const conversationSchema = new mongoose.Schema<IConversation>(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

// Index to quickly find conversation between 2 users
conversationSchema.index({ members: 1 });

const Conversation = mongoose.model<IConversation>("Conversation", conversationSchema);
export default Conversation