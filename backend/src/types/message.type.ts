import { Document, Types } from "mongoose"

export interface IMessage extends Document {
 conversationId: Types.ObjectId;
  sender: Types.ObjectId;
  text: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}