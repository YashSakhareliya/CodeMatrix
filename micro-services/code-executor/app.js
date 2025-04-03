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

app.get("/test-redis", async (req, res) => {
    try {
        await redis.set("testKey", "Hello, Redis!");
        const value = await redis.get("testKey");
        res.json({ message: "Redis Working!", value });
    } catch (error) {
        console.error("Redis Error:", error);
        res.status(500).json({ error: "Redis Error" });
    }
});

export default app;