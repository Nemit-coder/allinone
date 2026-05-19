import mongoose, { Document } from "mongoose"

export type PostType = "image" | "video" | "blog"

export interface IComment {
  _id: mongoose.Types.ObjectId
  user: mongoose.Types.ObjectId
  text: string
  createdAt: Date
}

export interface IPost extends Document {
  type: PostType
  media: string[]
  title: string
  tags: string[]
  description?: string
  likes: any[]        // mongoose.Types.ObjectId[] at runtime; 'any[]' avoids Document array conflicts
  comments: IComment[]
  uploadedBy: mongoose.Types.ObjectId
  createdAt: Date
}