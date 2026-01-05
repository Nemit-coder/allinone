import * as dotenv from 'dotenv'
dotenv.config()
import app from './app.ts'
import connectDatabase from './src/config/db.ts'

const startServer = async () => {
    try {
        await connectDatabase();

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port : ${process.env.PORT}`)
        })
    } catch (error) {
         console.error("Failed to start server", error);
         process.exit(1);
    }
}

startServer()
