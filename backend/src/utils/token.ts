import jwt, { type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.ts'

export const generateAccessToken = ( userId : string) => {
    const options: SignOptions = { expiresIn: env.ACCESS_TOKEN_EXPIRY as any }
    return jwt.sign(
        {id: userId},
        env.ACCESS_TOKEN_SECRET!,
        options
    )
}

export const generateRefreshToken = (userId: string) => {
  const options: SignOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRY as any }
  return jwt.sign(
    { id: userId },
    env.REFRESH_TOKEN_SECRET!,
    options
  )
}