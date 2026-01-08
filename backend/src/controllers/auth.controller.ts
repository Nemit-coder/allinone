import jwt from "jsonwebtoken"
import type { Request, Response } from 'express'
import User from "../models/user.model.ts"
import { generateAccessToken } from "../utils/token.ts"
import { env } from "../config/env.ts"

export const refreshAccessToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" })
  }

  const user = await User.findOne({ refreshToken })
  if (!user) return res.status(403).json({ message: "Invalid refresh token" })

  jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET!, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Token expired" })

    const accessToken = generateAccessToken(decoded.id)
    console.log("access token generated again")
    res.json({ accessToken })
  })
}

export const logoutUser = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
  
    if (refreshToken) {
      await User.findOneAndUpdate(
        { refreshToken },
        { refreshToken: null }
      )
    }
  
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    })
  
    res.status(200).json({ success: true })
  }
  
