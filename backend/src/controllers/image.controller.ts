import Image from '../models/image.model.ts'
import type {Request , Response} from 'express'

/* ====== Upload Image ====== */ 

const uploadImage = async (req: Request, res: Response) => {
    try {
        const { imageTitle , imageDescription} = req.body
        let uploadImageUrl = undefined
        if(req.file){
            uploadImageUrl = `uploads/images/${req.user?.id}/${req.file.filename}`
        }
    } catch (error) {
        
    }
}