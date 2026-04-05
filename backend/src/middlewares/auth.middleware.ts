import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from 'express'
import { env } from "../config/env.ts"

const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" })
  }

  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" })
  }
  
  jwt.verify(token, env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" })
      // console.log(req)
    req.user = decoded as {id:string}
    next()
  })
}

export default verifyJwt
