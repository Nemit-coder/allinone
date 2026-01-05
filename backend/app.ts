import express  from "express";
import userRouter from './src/routes/user.route.ts'
const app = express()

app.use(express.json())

// User Routes
app.use('/api/v1/users', userRouter)

export default app