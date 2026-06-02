import express from 'express'
import {registerUser, getUser , getPubllicProfileUser, loginUser, getCurrentUser, updateUserProfile, deleteUser, followUser, unfollowUser, acceptFollowRequest, rejectFollowRequest, getNotifications, searchUsers } from '../controllers/user.controller.ts'
import verifyJwt from '../middlewares/auth.middleware.ts'
import { singleAvatarUpload } from '../middlewares/upload.ts';
const router = express.Router()


router.get('/allusers',verifyJwt, getUser)
router.get('/me', verifyJwt, getCurrentUser)
router.get('/PublicProfileUser/:id',verifyJwt, getPubllicProfileUser)
router.get('/notifications', verifyJwt, getNotifications)
router.get("/search", verifyJwt, searchUsers)
router.post('/register', ...singleAvatarUpload, registerUser)
router.post('/login', loginUser)
router.post('/updateUserProfile',verifyJwt, ...singleAvatarUpload, updateUserProfile)
router.post('/delete/:id',verifyJwt,  deleteUser)
router.post('/follow/:id', verifyJwt, followUser)
router.post('/unfollow/:id', verifyJwt, unfollowUser)
router.post('/follow/accept/:id', verifyJwt, acceptFollowRequest)
router.post('/follow/reject/:id', verifyJwt, rejectFollowRequest)


export default router