import jwt from "jsonwebtoken"
import type { Request, Response } from 'express'
import User from "../models/user.model.ts"
import { generateAccessToken } from "../utils/token.ts"
import { generateResetCode } from "../utils/otp.ts"
import { sendEmail } from "../utils/email.ts"
import crypto from "crypto"
import { env } from "../config/env.ts"
import bcrypt from "bcrypt"

// RefressAccessToken
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

// Logout User
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
  
  // Forget Password
  export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ message: "User not found" })
  }

  const { code, hashedCode } = generateResetCode()

  user.resetPasswordCode = hashedCode
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min
  await user.save()

  await sendEmail({
    to: user.email,
    subject: "Your password reset code",
    html: `
      <h2>Password Reset</h2>
      <p>Your reset code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  })

  res.json(
    { 
      success: true,
      message: "Reset code sent to email"
     })
}

// Verify Reset Code
export const verifyResetCode = async (req: Request, res: Response) => {
  const { email, code } = req.body

  const hashedCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex")

  const user = await User.findOne({
    email,
    resetPasswordCode: hashedCode,
    resetPasswordExpires: { $gt: new Date() },
  })

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired code" })
  }

  res.json({ message: "Code verified successfully" })
}

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body

  const hashedCode = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex")

  const user = await User.findOne({
    email,
    resetPasswordCode: hashedCode,
    resetPasswordExpires: { $gt: new Date() },
  })

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired code" })
  }

  user.password = await bcrypt.hash(newPassword, 12)
  delete user.resetPasswordCode
  delete user.resetPasswordExpires

  await user.save()

  res.json({ message: "Password reset successful" })
}