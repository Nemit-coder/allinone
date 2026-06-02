import User from '../models/user.model.ts'
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import cloudinary from '../config/cloudinary.config.ts'
import { generateAccessToken, generateRefreshToken } from "../utils/token.ts"

 /* ===== Register ===== */
const registerUser = async (req : Request, res : Response) => {
    try {        
        const {userName, fullName, email, password, accountType} = req.body

          const avatarUrl = req.file?.path ?? ""
          const avatarPublicId = req.file?.filename ?? ""
          
        if (!email || !password || !userName || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            })
       }

       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
       if(!emailRegex.test(email)){
            return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        })
       }

        if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters'
        })
        }

        const normalizedEmail = email.toLowerCase()

        const fetchedUser = await User.findOne({email})
        if(fetchedUser) {
            return res.status(409).json({
                success: false,
                message : 'User already exists with this email'
             })
        }

        const saltRounds = 10
        const actualSalt = await bcrypt.genSalt(saltRounds)
        const passwordHash = await bcrypt.hash(password, actualSalt)

        const createUser = await User.create({
            userName: userName,
            fullName: fullName,
            email: normalizedEmail,
            password: passwordHash,
            avatar: {
                url: avatarUrl,
                publicId: avatarPublicId
            },
            accountType: accountType === "private" ? "private" : "public",
        })

        if(!createUser){
            return res.status(500).json({
                success: false,
                message: 'Error Creating User' 
             })
        }

        const accessToken = generateAccessToken(createUser._id.toString())
        const refreshToken = generateRefreshToken(createUser._id.toString())

        createUser.refreshToken = refreshToken
        await createUser.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
        return res.status(200).json({ 
            success: true,
            message: 'User Created Successfully',
            accessToken: accessToken,
            user: {
                id: createUser._id,
                email: normalizedEmail,
                avatar: createUser.avatar.url
            }
        })
    } catch (error : any) {
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

/* ===== Fetch Public Profile User ===== */
const getPubllicProfileUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        if (!id) {
            return res.status(400).json({ success: false, message: "User ID is required" })
        }
        const currentId = req.user!.id  // available because verifyJwt is on this route

        const PublicProfileUser = await User.findById(id)
            .select('-refreshToken -password -resetPasswordCode -resetPasswordExpires')

        if (!PublicProfileUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isOwnProfile = currentId.toString() === id.toString()

        const isFollowing = PublicProfileUser.followers.some(
            (fId) => fId.toString() === currentId.toString()
        )

        const isRequested = PublicProfileUser.followRequests.some(
            (fId) => fId.toString() === currentId.toString()
        )

        res.status(200).json({
            success: true,
            PublicProfileUser: {
                ...PublicProfileUser.toObject(),
                followersCount: PublicProfileUser.followers?.length ?? 0,
                followingCount: PublicProfileUser.following?.length ?? 0,
                isOwnProfile,
                isFollowing,
                isRequested,
            }
        })
    } catch (error: any) {
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" })
        }

       const user = await User.findById(userId).select('-refreshToken')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user,
        })
    } catch (error: any) {
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

/* ===== Fetch User ===== */
const getUser = async (req : Request, res: Response) => {
    try {
        const fetchedUser = await User.find()
        if(!fetchedUser){
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
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

/* ===== Login ===== */
const loginUser = async (req: Request, res : Response) => {
    try {
        const {email, password} = req.body
        const fetchedUser = await User.findOne({email})
        if(!fetchedUser) {
            return res.status(404).json({message: "User not found"})
        }

        const decodedPassword = await bcrypt.compare(password, fetchedUser.password ?? "")
        if(!decodedPassword){
            return res.status(401).json({message: "Invalid Password"})
        }

        const accessToken = generateAccessToken(fetchedUser._id.toString())
        const refreshToken = generateRefreshToken(fetchedUser._id.toString())

        fetchedUser.refreshToken = refreshToken
        await fetchedUser.save()

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
          })

        res.status(200).json({
            success: true,
            message: "Login successful",
            accessToken: accessToken,
            user: fetchedUser
        });
    } catch (error : any) {
        res.status(500).json({message : `Server Error : ${error.message}`})
    }
}

/* ===== Update ===== */
const updateUserProfile = async (req: Request, res : Response) => {
    try {
        const userId = req.user!.id
        const {email, userName, fullName , password} = req.body
         const updateData: any = {}

        if (email) updateData.email = email.toLowerCase()
        if (userName) updateData.userName = userName
        if (fullName) updateData.fullName = fullName
        if (password) updateData.password = password

         if (req.file) {
        const existingUser = await User.findById(userId)
        if (existingUser?.avatar?.publicId) {
            await cloudinary.uploader.destroy(existingUser.avatar.publicId)
        }

        updateData.avatar = {
            url: req.file.path,
            publicId: req.file.filename
        }
        }

       if (password && password.trim() !== "") {
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
        ).select('-refreshToken')

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        res.status(200).json({
            success: true,
            message: " User Profile has been updated successfully",
            user: updatedUser
        })

    } catch (error : any) {
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
        res.status(500).json({
            success: true,
            message : `Server Error : ${error.message}`})
    }
}

/* ===== Follow / Unfollow ===== */
const followUser = async (req: Request, res: Response) => {
    try {
        const targetId = req.params.id
        const currentId = req.user!.id

        if (targetId === currentId.toString()) {
            return res.status(400).json({ success: false, message: "You cannot follow yourself" })
        }

        const targetUser = await User.findById(targetId)
        const currentUser = await User.findById(currentId)

        if (!targetUser || !currentUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const alreadyFollowing = targetUser.followers.some(
            (fId) => fId.toString() === currentId.toString()
        )
        if (alreadyFollowing) {
            return res.status(400).json({ success: false, message: "Already following" })
        }

        const alreadyRequested = targetUser.followRequests.some(
            (fId) => fId.toString() === currentId.toString()
        )
        if (alreadyRequested) {
            return res.status(400).json({ success: false, message: "Request already sent" })
        }

        if (targetUser.accountType === "private") {
            await User.findByIdAndUpdate(targetId, {
                $addToSet: { followRequests: currentId }
            })
            return res.status(200).json({ success: true, status: "requested" })
        } else {
            await User.findByIdAndUpdate(targetId, { $addToSet: { followers: currentId } })
            await User.findByIdAndUpdate(currentId, { $addToSet: { following: targetId } })
            return res.status(200).json({ success: true, status: "following" })
        }

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const unfollowUser = async (req: Request, res: Response) => {
    try {
        const targetId = req.params.id
        const currentId = req.user!.id

        await User.findByIdAndUpdate(targetId, {
            $pull: { followers: currentId, followRequests: currentId }
        })
        await User.findByIdAndUpdate(currentId, {
            $pull: { following: targetId }
        })

        return res.status(200).json({ success: true, status: "none" })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

/* ===== Accept / Reject Follow Request ===== */
const acceptFollowRequest = async (req: Request, res: Response) => {
    try {
        const requesterId = req.params.id
        const currentId = req.user!.id

        await User.findByIdAndUpdate(currentId, {
            $pull: { followRequests: requesterId },
            $addToSet: { followers: requesterId }
        })
        await User.findByIdAndUpdate(requesterId, {
            $addToSet: { following: currentId }
        })

        return res.status(200).json({ success: true, message: "Follow request accepted" })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

const rejectFollowRequest = async (req: Request, res: Response) => {
    try {
        const requesterId = req.params.id
        const currentId = req.user!.id

        await User.findByIdAndUpdate(currentId, {
            $pull: { followRequests: requesterId }
        })

        return res.status(200).json({ success: true, message: "Follow request rejected" })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}

/* ===== Get Notifications ===== */
const getNotifications = async (req: Request, res: Response) => {
    try {
        const currentId = req.user!.id

        const user = await User.findById(currentId)
            .populate('followRequests', 'userName fullName avatar')

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        return res.status(200).json({
            success: true,
            followRequests: user.followRequests,
            count: user.followRequests.length
        })
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message })
    }
}


export const searchUsers = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string)?.trim()
    if (!q) return res.json({ success: true, users: [] })

    const myId = req.user!.id

    const users = await User.find({
      _id: { $ne: myId },           // exclude self
      userName: { $regex: q, $options: "i" }  // case-insensitive
    })
      .select("userName avatar")
      .limit(10)

    res.json({ success: true, users })
  } catch {
    res.status(500).json({ message: "Server error" })
  }
}

export {
    registerUser, loginUser, getUser, getCurrentUser,
    getPubllicProfileUser, updateUserProfile, deleteUser,
    followUser, unfollowUser, acceptFollowRequest, rejectFollowRequest, getNotifications
}