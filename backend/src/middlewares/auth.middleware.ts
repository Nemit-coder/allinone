import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import {env} from '../config/env.ts'

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

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.headers.authorization
     if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        return res.status(401).json({
        message: 'Access token missing'
      })
    }

    const token = authHeaders.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        message: 'Invalid authorization header format'
      })
    }

    try {
        const decoded = jwt.verify(
          token,
          env.JWT_SECRET
        ) as unknown as JwtPayload

        req.user = {id: decoded.id}
        
        next()
    } catch (error) {
        return res.status(401).json({
          message: 'Invalid or expired token'
        })
    }
}

export default verifyJwt