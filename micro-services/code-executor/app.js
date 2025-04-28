import dotenv from 'dotenv'
dotenv.config()
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { exec } from 'child_process';
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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


app.post('/api/submit', async (req, res) => {
    const { code, language, testCases } = req.body;

    const submissionId = `submission_${Date.now()}`;
    const codeDir = path.join('/temp', submissionId); // container path
    const hostTempDir = path.join(process.cwd(), 'temp', submissionId); // host path

    try {
        await fs.mkdir(codeDir, { recursive: true });

        const codeFile = language === 'python' ? 'script.py' : 'script.cpp';
        await fs.writeFile(path.join(codeDir, codeFile), code);

        const files = await fs.readdir(codeDir);
        console.log('Files in codeDir:', files);

        const testCase = testCases && testCases.length > 0 ? testCases[0] : { input: '', expectedOutput: null };
        // Write input file using container path
        await fs.writeFile(path.join(codeDir, 'input.txt'), testCase.input || '');

        // Docker setup
        const image = language === 'python' ? 'yashsakhareliya/python-executor' : 'yashsakhareliya/cpp-executor';
        const timeout = 5000; // 5 seconds

        // Use host path for Docker volume and input redirection
        const inputPathOnHost = path.join(hostTempDir, 'input.txt');
        
        // FIXED: Override the CMD in the Dockerfile to run the script directly
        const dockerCmd = `
            docker run --rm \
            -v "${hostTempDir}:/app" \
            --memory="256m" \
            --cpus="0.5" \
            --network="none" \
            -w /app \
            ${image} python /app/${codeFile} < "${inputPathOnHost}"
        `.trim();
        console.log(`Executing Docker command: ${dockerCmd}`);

        exec(dockerCmd, { timeout }, async (error, stdout, stderr) => {
            let result = {};
            if (error) {
                if (error.killed) {
                    result = { status: 'timeout', error: 'Time Limit Exceeded' };
                } else {
                    result = { status: 'error', error: stderr || error.message };
                }
                console.log(`Error occurred: ${result.error}`);
            } else {
                const output = stdout.trim();
                result = {
                    status: 'success',
                    output,
                    testCaseResult: testCase.expectedOutput
                        ? { passed: output === testCase.expectedOutput.trim(), expected: testCase.expectedOutput }
                        : null,
                };
                console.log(`Execution successful. Output: ${output}`);
            }
            res.json(result);
            await fs.rm(codeDir, { recursive: true });
        });

    } catch (err) {
        console.error(`Unexpected error: ${err.message}`);
        res.status(500).json({ error: 'Execution failed', details: err.message });
        await fs.rm(codeDir, { recursive: true }).catch(() => console.log('Cleanup failed'));
    }
});

export default app;