import { Document, Types } from "mongoose";

export interface IUser extends Document {
    userName: string,
    fullName: string,
    email: string,
    password?: string, // Optional for OAuth users
    avatar: {
      url: string;
      publicId: string;
    },
    refreshToken?: string,
    resetPasswordCode?: string,
    resetPasswordExpires?: Date,
    followers: Types.ObjectId[],
    following: Types.ObjectId[],
    accountType: "public" | "private",
    followRequests: Types.ObjectId[]
}