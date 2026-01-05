import express  from "express";
import router from './src/routes/user.route.ts'
const app = express()

app.use(express.json())

// User Routes
app.use('/api/v1/users', router)

export default app