import mongoose, { mongo } from "mongoose";
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
        required: true
    },
    password: {
        type : String,
        required: true
    },
    avatar: {
        type : String
    },
    refreshToken: {
        type: String
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User