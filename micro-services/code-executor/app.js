import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { urlencoded } from 'express';
import redis, { connectRedis } from './config/redis.config.js';


const app = express()
connectRedis();

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
}))

app.get('/', (req, res) => {
    res.send('Hello, Code-executor!')
})

export default app;