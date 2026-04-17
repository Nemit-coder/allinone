import Image from '../models/image.model.ts'
import type {Request , Response} from 'express'

/* ====== Upload Image ====== */ 

const uploadImage = async (req: Request, res: Response) => {
    try {
        const { imageTitle , imageDescription} = req.body
        // let uploadImageUrl = undefined
        const uploadImageUrls: string[] = []
        const files = req.files as Express.Multer.File[];

        if (files && files.length > 0) {
            files.forEach((file) => {
                uploadImageUrls.push(
                    `uploads/images/${req.user?.id}/${file.filename}`
                )
            })
        }

        if(!imageTitle || !imageDescription || !req.user?.id){
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            })
        }

        const createImage = await Image.create({
            uploadedImage: uploadImageUrls ?? "",
            imageTitle: imageTitle,
            imageDescription: imageDescription,
            uploadedBy: req.user.id
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