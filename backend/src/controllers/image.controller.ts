import Image from '../models/image.model.ts'
import type {Request , Response} from 'express'

/* ====== Upload Image ====== */ 

const uploadImage = async (req: Request, res: Response) => {
    try {
        const { imageTitle , imageDescription} = req.body
        let uploadImageUrl = undefined
        const files = req.files as Express.Multer.File[];

        if (files && files.length > 0) {
        uploadImageUrl = files[0] ? `uploads/images/${req.user?.id}/${files[0].filename}` : undefined;
        }

        if(!imageTitle || !imageDescription){
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            })
        }

        const createImage = await Image.create({
            uploadedImage: uploadImageUrl ?? "",
            imageTitle: imageTitle,
            imageDescription: imageDescription
        })

        if(!createImage) {
            return res.status(500).json({
                success: false,
                message: 'Error Uploading Image'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Image Uploaded Successfully',
            uploadedImage: createImage
        })

        console.log(createImage)
    } catch (error: any) {
        res.status(500).json({ message: `Server Error : ${error.message}` })
    }
}

export  {
    uploadImage
}