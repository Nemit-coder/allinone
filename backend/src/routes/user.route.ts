import express from 'express'
const router = express.Router()
import {registerUser, getUser , loginUser} from '../controllers/user.controller.ts'

router.get('/allusers', getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)

export default router