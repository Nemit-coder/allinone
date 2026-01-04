import mongoose from "mongoose";
import {env} from './env.ts'

const connectDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(env.MONGO_DB_URL)
        console.log(`Database Connected Successfully with Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`Error Connecting Database : ${error}`)
    }
}

export default connectDatabase