import express from 'express'
const router = express.Router()
import {registerUser, getUser} from '../controllers/user.controller.ts'

router.post('/register', registerUser)
router.get('/allusers', getUser)

export default router