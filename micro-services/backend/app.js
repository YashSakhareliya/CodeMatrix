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
import userAuthRoute from './routes/studentAuth.route.js'

app.use('/auth/student', userAuthRoute)
app.get('/', (req, res)=>{
    res.send("Hello world! with dockers!")
})


export default app;
