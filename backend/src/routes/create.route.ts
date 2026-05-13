import express from 'express'
import { uploadPost , getPosts, getPostStats} from '../controllers/post.controller.ts'
import verifyJwt from '../middlewares/auth.middleware.ts'
import { multipleImageUpload , singleVideoUpload} from '../middlewares/upload.ts';
import multer from 'multer'
const router = express.Router()

const blogParser = multer()


router
.post('/createPost/image', verifyJwt, multipleImageUpload, uploadPost)
.post('/createPost/video', verifyJwt, singleVideoUpload, uploadPost)
.post('/createPost/blog', verifyJwt, blogParser.none(), uploadPost)
.get('/getPosts', verifyJwt, getPosts)
.get('/getPosts/:id',verifyJwt,  getPosts)
.get('/getPostStats', verifyJwt, getPostStats)


export default router