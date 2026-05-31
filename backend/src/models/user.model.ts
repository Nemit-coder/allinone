import mongoose from "mongoose";
import type {IUser} from '../types/user.type.js'

const userSchema = new mongoose.Schema<IUser>({
    userName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type : String,
        required: false // Optional for OAuth users
    },
    avatar: {
        url: {
            type: String,
            default: "https://ui-avatars.com/api/?name=biily"
        },
        publicId: {
            type: String,
            default: ""
        }
    },
    refreshToken: {
        type: String
    },
    accountType: {
    type: String,
        enum: ["public", "private"],
        default: "public"
    },
    resetPasswordCode: {
        type: String
    },
    resetPasswordExpires: {
        type: Date,
    },
    followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    followRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],             
})

const User = mongoose.model<IUser>('User', userSchema)
export default User