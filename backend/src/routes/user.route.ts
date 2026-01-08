import express from 'express'
import {registerUser, getUser , loginUser, getCurrentUser, updateUser, deleteUser} from '../controllers/user.controller.ts'
import verifyJwt from '../middlewares/auth.middleware.ts'
const router = express.Router()


router.get('/allusers',verifyJwt, getUser)
router.get('/me', verifyJwt, getCurrentUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/update/:id',verifyJwt, updateUser)
router.post('/delete/:id',verifyJwt,  deleteUser)


export default router