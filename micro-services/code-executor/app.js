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
    const hostTempDir = path.join('/temp', submissionId);
    const codeDir = hostTempDir;

    try {
        await fs.mkdir(hostTempDir, { recursive: true, mode: 0o777 });
        
        console.log(`Created directory: ${hostTempDir}`);
        
        const tempFiles = await fs.readdir('/temp');
        console.log('Files in /temp:', tempFiles);

        const codeFile = language === 'python' ? 'script.py' : 'script.cpp';
        const codeFilePath = path.join(hostTempDir, codeFile);
        await fs.writeFile(codeFilePath, code, { mode: 0o666 });
        console.log(`Created code file: ${codeFilePath}`);

        const testCase = testCases && testCases.length > 0 ? testCases[0] : { input: '', expectedOutput: null };
        const inputFilePath = path.join(hostTempDir, 'input.txt');
        await fs.writeFile(inputFilePath, testCase.input || '', { mode: 0o666 });
        console.log(`Created input file: ${inputFilePath}`);

        const files = await fs.readdir(codeDir);
        console.log('Files in codeDir:', files);
        
        console.log('Host temp directory:', hostTempDir);
        console.log('Input file path:', inputFilePath);
        
        try {
            const inputFileExists = await fs.access(inputFilePath)
                .then(() => true)
                .catch(() => false);
            console.log('Input file exists:', inputFileExists);
        } catch (err) {
            console.error('Error checking input file:', err);
        }

        const image = language === 'python' ? 'yashsakhareliya/python-executor' : 'yashsakhareliya/cpp-executor';
        const timeout = 5000; // 5 seconds

        const absoluteHostTempDir = path.resolve(hostTempDir);
        console.log('Absolute host temp directory:', absoluteHostTempDir);

        const dockerCmd = `
            docker run --rm \
            -v "${absoluteHostTempDir}:/app" \
            --memory="256m" \
            --cpus="0.5" \
            --network="none" \
            -w /app \
            ${image} bash -c "ls -la /app && echo 'Contents of input.txt:' && cat /app/input.txt && echo 'Running Python script:' && python /app/${codeFile}"
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