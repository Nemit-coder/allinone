import mongoose , {Document} from "mongoose"

export interface IImage extends Document {
    uploadedImage: [string],
    imageTitle: string,
    imageDescription: string,
    uploadedBy: mongoose.Types.ObjectId
}