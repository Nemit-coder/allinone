import {Document} from "mongoose"

export interface IImage extends Document {
    uploadedImage: string,
    imageTitle: string,
    imageDescription: string
}