import express  from "express";
import userRouter from './src/routes/user.route.ts'
import authRouter from './src/routes/auth.route.ts'
import cors from 'cors'
import cookieParser from "cookie-parser"
const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }))

  app.use((req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });



// User Routes
app.use('/api/v1/users', userRouter)
// Auth Routes
app.use('/api/v1/auth', authRouter)

export default app