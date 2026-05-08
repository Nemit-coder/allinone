import mongoose , {Document} from "mongoose"

export type PostType = "image" | "video" | "blog"

export interface IPost extends Document {
    type: PostType
    media: string[],
    title: string,
    description? :string,
    uploadedBy: mongoose.Types.ObjectId
    createdAt: Date
}