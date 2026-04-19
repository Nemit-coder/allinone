import express from 'express'
import { uploadImage , getImages} from '../controllers/image.controller.ts'
import verifyJwt from '../middlewares/auth.middleware.ts'
import { multipleImageUpload } from '../middlewares/upload.ts';
const router = express.Router()


router
.post('/createImage', verifyJwt, multipleImageUpload, uploadImage)
.get('/getIsages', verifyJwt, getImages)


export default router