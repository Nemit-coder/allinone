import express from 'express'
import {registerUser, getUser , loginUser, getCurrentUser, updateUserProfile, deleteUser} from '../controllers/user.controller.ts'
import verifyJwt from '../middlewares/auth.middleware.ts'
import { singleAvatarUpload } from '../middlewares/upload.ts';
const router = express.Router()


router.get('/allusers',verifyJwt, getUser)
router.get('/me', verifyJwt, getCurrentUser)
router.post('/register',singleAvatarUpload, registerUser)
router.post('/login', loginUser)
router.post('/updateUserProfile',verifyJwt,singleAvatarUpload, updateUserProfile)
router.post('/delete/:id',verifyJwt,  deleteUser)


export default router