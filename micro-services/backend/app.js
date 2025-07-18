import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import redis, { connectRedis } from './config/redis.config.js'
import { urlencoded } from 'express';
import { connectMongoDb } from './config/db.config.js'; 
import Submission from './models/submission.model.js'

const app = express()
connectMongoDb()
connectRedis()

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true, 
}))


// import routes 
import studentAuthRoute from './routes/studentAuth.route.js'
import instructorAuthRoute from './routes/instructorAuth.route.js'
import instructorService from './routes/instructor.route.js'
import studentDashboard from './routes/studentDashboard.route.js'

app.use('/auth/student', studentAuthRoute)
app.use('/auth/instructor', instructorAuthRoute)
app.use('/instructor', instructorService)
app.use('/student', studentDashboard)
app.get('/', (req, res)=>{
    res.send("Hello world! with dockers!")
})


export default app;
