import { Document , Types } from "mongoose";

export interface IConversation extends Document {
  members: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}