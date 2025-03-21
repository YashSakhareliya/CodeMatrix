import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import { urlencoded } from 'express';
import { connectMongoDb } from './config/db.config.js'; 

const app = express()
connectMongoDb()

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))


// import routes 
import userRoute from './routes/user.route.js'

app.use('/user', userRoute)
app.get('/', (req, res)=>{
    res.send("Hello world! with dockers!")
})


export default app;
