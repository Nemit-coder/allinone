import express from 'express'
const router = express.Router()
import {registerUser} from '../controllers/user.controller.ts'

router.post('/register', registerUser)

export default router