import express  from "express";
const app = express()

app.get('/api/v1', (req, res) => {
    res.end("Jelow")
})

export default app