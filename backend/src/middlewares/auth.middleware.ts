import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'

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

    // try {
    //     const decoded = jwt.verify(
    //   token,
    //   process.env.ACCESS_TOKEN_SECRET!
    // ) as JwtPayload
    // } catch (error) {
        
    // }


}