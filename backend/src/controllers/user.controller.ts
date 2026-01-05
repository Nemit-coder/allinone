import User from '../models/user.model.ts'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'

 // Register User
const registerUser = async (req : Request, res : Response) => {
    try {
        const {userName, fullName, email, password, avatar} = req.body
        // ==> Validating Required Fields
        if (!email || !password || !userName || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            })
       }

       // ==> Validating Email (regex)
       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
       if(!emailRegex.test(email)){
            return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        })
       }

       // ==> Validating Password Length
        if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        })
        }

        // ==> Checking if user already exist
        const fetchedUser = await User.findOne({email})
        if(fetchedUser) {
            return res.status(409).json({
                success: false,
                message : 'User already exists with this email'
             })
        }

        // ==> Hashing the plain password
        const saltRounds = 10
        const actualSalt = await bcrypt.genSalt(saltRounds)
        const passwordHash = await bcrypt.hash(password, actualSalt)
        const normalizedEmail = email.toLowerCase()

        // ==> Creating final user
        const createUser = await User.create({
            userName: userName,
            fullName: fullName,
            email: normalizedEmail,
            password: passwordHash,
            avatar: avatar,
            // refreshToken: refreshToken
        })

        if(!createUser){
            return res.status(500).json({
                success: false,
                message: 'Error Creating User' 
             })
        }

        res.status(200).json({ 
            success: true,
            message: 'User Created Successfully',
            user: {
                id: createUser._id,
                email: normalizedEmail
            }
        })
    } catch (error : any) {
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

const getUser = async (req : Request, res: Response) => {

}

export {
    registerUser
}