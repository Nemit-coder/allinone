import { Router } from "express"
import passport from "passport"
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts"
import {forgotPassword , verifyResetCode,resetPassword } from "../controllers/auth.controller.ts"
import User from "../models/user.model.js"
import { refreshAccessToken, logoutUser } from "../controllers/auth.controller.ts"

const router = Router()

// Refresh access token
router.post("/refresh", refreshAccessToken)

// Logout
router.post("/logout", logoutUser)

router.post("/forgotPassword", forgotPassword)
router.post("/verify-reset-code", verifyResetCode)
router.post("/reset-password", resetPassword)


// STEP 1: redirect to Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
  })
)

// STEP 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: any, res) => {
    const user = req.user

    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // redirect back to frontend
    res.redirect(
      `http://localhost:5173/auth/callback?token=${accessToken}`
    )
  }
)

export default router

