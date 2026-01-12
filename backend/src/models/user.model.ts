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
        type : String,
        default: "https://ui-avatars.com/api/?name=biily"
    },
    refreshToken: {
        type: String
    },
    resetPasswordCode: {
        type: String
    },
    resetPasswordExpires: {
        type: Date,
    },
})

const User = mongoose.model<IUser>('User', userSchema)
export default User