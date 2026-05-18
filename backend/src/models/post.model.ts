import mongoose from "mongoose"
import type {IPost} from '../types/post.type'

const postSchema = new mongoose.Schema<IPost>({
    type :{
        type : String,
        enum: ["image","video","blog"],
        required: true
    },
    media: {
        type: [String],
        default: []
    },
    title: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    description: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: []
    },
    comments: [
        {
            user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
            },

            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Post = mongoose.model<IPost>('Post', postSchema)
export default Post