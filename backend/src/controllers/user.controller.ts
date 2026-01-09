import User from '../models/user.model.ts'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {env} from '../config/env.ts'
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts"

 /* ===== Register ===== */
const registerUser = async (req : Request, res : Response) => {
    try {        
        const {userName, fullName, email, password, avatar} = req.body
        let avatarUrl = undefined;
        if (req.file) {
          avatarUrl = `/uploads/avatars/${req.file.filename}`;
        }
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
            avatar: avatarUrl ?? "",
            // refreshToken: refreshToken
        })

        if(!createUser){
            return res.status(500).json({
                success: false,
                message: 'Error Creating User' 
             })
        }

        // Generate tokens for automatic login after registration
        const accessToken = generateAccessToken(createUser._id.toString())
        const refreshToken = generateRefreshToken(createUser._id.toString())

        createUser.refreshToken = refreshToken
        await createUser.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({ 
            success: true,
            message: 'User Created Successfully',
            accessToken: accessToken,
            user: {
                id: createUser._id,
                email: normalizedEmail,
                avatar: createUser.avatar
            }
        })
        console.log(`User created successfully : ${createUser.userName}`)
    } catch (error : any) {
        console.log(`Server Error : ${error.message}`)
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

/* ===== Fetch Current User ===== */
const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id
        const user = await User.findById(userId).select('-password -refreshToken')
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user
        })
    } catch (error: any) {
        console.log(`Server Error : ${error.message}`)
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

/* ===== Fetch User ===== */
const getUser = async (req : Request, res: Response) => {
    try {
        // ==> Fetching user
        const fetchedUser = await User.find()
        if(!fetchedUser){
            console.log('Error finding users')
            return res.json({
                success: false,
                message: "Error finding users"
            })
        }

        res.status(200).json({
            success: true,
            users : fetchedUser
        })
    } catch (error: any) {
        console.log(`Server Error : ${error.message}`)
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

/* ===== Login ===== */
const loginUser = async (req: Request, res : Response) => {
    try {
        const {email, password} = req.body
        const fetchedUser = await User.findOne({email})
        if(!fetchedUser) {
            console.log("User not found")
            return res.status(404).json({message: "User not found"})
        }

        // ==> Decoding password
        const decodedPassword = await bcrypt.compare(password, fetchedUser.password ?? "")
        if(!decodedPassword){
            console.log("password incorrect")
            return res.status(401).json({message: "Invalid Password"})
        }

        // ==> Payload
        // const payload = {
        //     id: fetchedUser._id,
        //     email : fetchedUser.email,
        //     userName: fetchedUser.userName
        // }
        // ==> Token Signing
        const accessToken = generateAccessToken(fetchedUser._id.toString())
        const refreshToken = generateRefreshToken(fetchedUser._id.toString())

        fetchedUser.refreshToken = refreshToken
        await fetchedUser.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
          })

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken,
            user: fetchedUser
        });
    } catch (error : any) {
        console.log(error.message)
        res.status(500).json({message : `Server Error : ${error.message}`})
    }
}

/* ===== Update ===== */
const updateUser = async (req: Request, res : Response) => {
    try {
        const userId = req.user!.id
        const {email, password, userName, fullName, avatar} = req.body
         const updateData: any = {}

         // ==> Checking if Fields are given for updation
        if (email) updateData.email = email.toLowerCase()
        if (userName) updateData.userName = userName
        if (fullName) updateData.fullName = fullName
        if (avatar) updateData.avatar = avatar

        if (password) {
            console.log(password)
        updateData.password = await bcrypt.hash(password, 10)
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided to update'
            })
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select('-password -refreshToken')

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: " User has been updated successfully",
            user: updatedUser
        })

    } catch (error : any) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message : `Server Error : ${error.message}`})
     }
}

/* ===== Delete ===== */
const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id
        const findUser = await User.findByIdAndDelete(userId)

        if(!findUser){
            return res.json(400).json({
                success: false,
                message: "User was not deleted"
            })
        }

        res.status(200).json({
            success: false,
            message: "User was deleted successfully"
        })
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({
            success: true,
            message : `Server Error : ${error.message}`})
    }
}

export {
    registerUser,
    loginUser,
    getUser,
    getCurrentUser,
    updateUser,
    deleteUser
}