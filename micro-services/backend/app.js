import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import { urlencoded } from 'express'; 

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))

app.get('/', (req, res)=>{
    res.send("Hello world! with dockers!")
})


export default app;
