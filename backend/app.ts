import express  from "express";
import userRouter from './src/routes/user.route.ts'
import authRouter from './src/routes/auth.route.ts'
import cors from 'cors'
import cookieParser from "cookie-parser"
import passport from "./src/config/passport.config.js"
import path from 'path'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }))

// User Logs  
// app.use((req, res, next) => { console.log(`${req.method} ${req.path}`); next(); });



// User Routes
app.use('/api/v1/users', userRouter)
// Auth Routes
app.use('/api/v1/auth', authRouter)

export default app