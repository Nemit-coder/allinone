import { Document } from "mongoose";

export interface IUser extends Document {
    userName: string,
    fullName: string,
    email: string,
    password: string,
    avatar: string,
    refreshToken: string
}