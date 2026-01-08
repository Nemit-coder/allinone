import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from 'express'
import { env } from "../config/env.ts"

declare global {
  namespace Express{
    interface Request {
      user?: JwtPayload;
    }
  }
}
interface JwtPayload {
    id: string
}

const verifyJwt = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" })
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" })
  }
  
  jwt.verify(token, env.ACCESS_TOKEN_SECRET as string, (err: any, decoded: any) => {
    if (err) return res.status(403).json({ message: "Invalid token" })
    req.user = decoded
    next()
  })
}

export default verifyJwt
