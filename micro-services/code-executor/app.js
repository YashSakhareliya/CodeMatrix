import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { urlencoded } from 'express';
import redisClient, { connectRedis } from './config/redis.config.js';
import { connectMongoDb } from './config/db.config.js';

const app = express()
connectRedis();
connectMongoDb();

app.use(express.json())
app.use(cookieParser())
app.use(urlencoded({ extended: true }))
app.use(cors({
    origin: "http://localhost:5000",
    credentials: true,
}))

app.get('/', (req, res) => {
    res.send('Hello, Code-executor!')
})

app.get("/test-redis", async (req, res) => {
    try {
        await redisClient.set("testKey", "Hello, Redis!");
        const value = await redisClient.get("testKey");
        res.json({ message: "Redis Working!", value });
    } catch (error) {
        console.error("Redis Error:", error);
        res.status(500).json({ error: "Redis Error" });
    }
});


async function processQueue() {
    while (true) {
        console.log("Redis is running")
        const task = await redisClient.brpop('submissionQueue', 0);
        const { submissionId, code, language, testCases } = JSON.parse(task[1]); // brpop returns [queue, value]

        const codeDir = path.join(process.cwd(), 'temp', submissionId);
        await fs.mkdir(codeDir, { recursive: true });

        try {
            const codeFile = language === 'python' ? 'script.py' : 'script.cpp';
            await fs.writeFile(path.join(codeDir, codeFile), code);

            const testCase = testCases[0] || { input: '', expectedOutput: null };
            const inputPath = path.join(codeDir, 'input.txt');
            await fs.writeFile(inputPath, testCase.input || '');

            const image = language === 'python' ? 'python-executor' : 'cpp-executor';
            const dockerCmd = `
          docker run --rm \
          -v "${codeDir}:/app" \
          --memory="256m" \
          --cpus="0.5" \
          --network="none" \
          -i ${image} < "${inputPath}"
        `.trim();

            exec(dockerCmd, { timeout: 5000 }, async (error, stdout, stderr) => {
                let result = {};
                if (error) {
                    if (error.killed) {
                        result = { status: 'timeout', error: 'Time Limit Exceeded' };
                    } else {
                        result = { status: 'error', error: stderr || error.message };
                    }
                } else {
                    const output = stdout.trim();
                    result = {
                        status: 'success',
                        output,
                        testCaseResult: testCase.expectedOutput
                            ? { passed: output === testCase.expectedOutput.trim(), expected: testCase.expectedOutput }
                            : null,
                    };
                }

                // Push result back to backend via Redis
                await redisClient.lpush('executionResults', JSON.stringify({
                    submissionId,
                    result,
                }));

                await fs.rm(codeDir, { recursive: true });
            });
        } catch (err) {
            // Push error result back to backend
            await redisClient.lpush('executionResults', JSON.stringify({
                submissionId,
                result: { status: 'error', error: err.message },
            }));
            await fs.rm(codeDir, { recursive: true });
        }
    }
}

export { processQueue }
export default app;