import { Document } from "mongoose";

export interface IUser extends Document {
    userName: string,
    fullName: string,
    email: string,
    password?: string, // Optional for OAuth users
    avatar: string,
    refreshToken?: string
}