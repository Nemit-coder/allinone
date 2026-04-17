import mongoose from "mongoose"
import type {IImage} from '../types/image.type'

const imageSchema = new mongoose.Schema<IImage>({
    uploadedImage: {
        type: [String],
        required: true
    },
    imageTitle: {
        type: String,
        required: true
    },
    imageDescription: {
        type: String
    },
    uploadedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Image = mongoose.model<IImage>('Image', imageSchema)
export default Image