import express from 'express'
import {registerUser, getUser , loginUser, updateUser, deleteUser} from '../controllers/user.controller.ts'
import verifyJwt from '../middlewares/auth.middleware.ts'
const router = express.Router()


router.get('/allusers',verifyJwt, getUser)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/update/:id',verifyJwt, updateUser)
router.post('/delete/:id',verifyJwt,  deleteUser)


export default router