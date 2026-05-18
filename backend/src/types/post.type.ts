import mongoose , {Document} from "mongoose"

export type PostType = "image" | "video" | "blog"

export interface IPost extends Document {
    type: PostType
    media: string[],
    title: string,
    tags: string[],
    description? :string,
    likes: mongoose.Types.ObjectId,
    comments: {
        user: mongoose.Types.ObjectId,
        text: string,
        createdAt: Date
    }
    uploadedBy: mongoose.Types.ObjectId
    createdAt: Date
}