import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)


const connectRedis = () => {
    redis.on("connect", () => console.log("Connected to Redis!"));
    redis.on("error", (err) => console.error("Redis connection error:", err));
}


export { connectRedis }
export default redis;