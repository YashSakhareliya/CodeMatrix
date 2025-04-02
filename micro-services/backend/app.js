import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { urlencoded } from 'express';
import { connectMongoDb } from './config/db.config.js'; 

const app = express()
connectMongoDb()

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}))


// import routes 
import studentAuthRoute from './routes/studentAuth.route.js'
import instructorAuthRoute from './routes/instructorAuth.route.js'
import instructorService from './routes/instructor.route.js'

app.use('/auth/student', studentAuthRoute)
app.use('/auth/instructor', instructorAuthRoute)
app.use('/instructor', instructorService)
app.get('/', (req, res)=>{
    res.send("Hello world! with dockers!")
})


export default app;
