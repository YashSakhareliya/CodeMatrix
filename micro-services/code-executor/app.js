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

// --- Get paths ---
// Path INSIDE the outer container where Node writes files
const CONTAINER_SUBMISSION_DIR = '/submissions';
// Path ON THE HOST machine, passed via environment variable
// Add this near the top of your main Node.js file (e.g., index.js or app.js)
const HOST_SUBMISSION_DIR_FROM_ENV = process.env.HOST_SUBMISSION_DIR;
console.log(`***** DEBUG: Raw process.env.HOST_SUBMISSION_DIR = ${HOST_SUBMISSION_DIR_FROM_ENV} *****`);

// Check if it actually looks like an absolute path
if (HOST_SUBMISSION_DIR_FROM_ENV && !path.isAbsolute(HOST_SUBMISSION_DIR_FROM_ENV)) {
    console.warn(`***** WARNING: HOST_SUBMISSION_DIR (${HOST_SUBMISSION_DIR_FROM_ENV}) does not seem to be an absolute path! Check docker-compose.yml and PWD resolution. *****`);
}

// Use this value later...
const HOST_SUBMISSION_DIR = HOST_SUBMISSION_DIR_FROM_ENV;

if (!HOST_SUBMISSION_DIR) {
    console.error("ERROR: HOST_SUBMISSION_DIR environment variable is not set!");
    process.exit(1); // Exit if the crucial path is missing
}
console.log(`Host Submission Directory (for Docker volume): ${HOST_SUBMISSION_DIR}`);
console.log(`Container Submission Directory (for Node fs): ${CONTAINER_SUBMISSION_DIR}`);

app.get('/', (req, res) => {
    if (!HOST_SUBMISSION_DIR) {
        console.log("WARNING: HOST_SUBMISSION_DIR is not set, Docker execution will likely fail.");
    }
    console.log(`Host Submission Directory (for Docker volume): ${HOST_SUBMISSION_DIR}`);
    console.log(`Container Submission Directory (for Node fs): ${CONTAINER_SUBMISSION_DIR}`);
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

    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    // Directory path INSIDE the Node container (e.g., /submissions/submission_123)
    const containerCodeDir = path.join(CONTAINER_SUBMISSION_DIR, submissionId);
    // Directory path ON THE HOST (e.g., /home/user/project/micro-services/code-executor/submissions/submission_123)
    const hostCodeDir = path.join(HOST_SUBMISSION_DIR, submissionId);

    try {
        // Create directory using the path INSIDE the container
        await fs.mkdir(containerCodeDir, { recursive: true, mode: 0o777 });
        console.log(`Created directory inside container: ${containerCodeDir}`);
        console.log(`Corresponding host directory: ${hostCodeDir}`);

        // Determine filenames
        const codeFile = language === 'python' ? 'script.py' : 'script.cpp'; // Add more languages as needed
        const codeFilePath = path.join(containerCodeDir, codeFile);
        const inputFilePath = path.join(containerCodeDir, 'input.txt');

        // Get test case input
        const testCase = testCases && testCases.length > 0 ? testCases[0] : { input: '', expectedOutput: null };

        // Write code and input files using the path INSIDE the container
        await fs.writeFile(codeFilePath, code, { mode: 0o666 });
        console.log(`Created code file: ${codeFilePath}`);
        await fs.writeFile(inputFilePath, testCase.input || '', { mode: 0o666 });
        console.log(`Created input file: ${inputFilePath}`);

        // --- Prepare for Inner Container ---
        const image = language === 'python' ? 'yashsakhareliya/python-executor' : 'yashsakhareliya/cpp-executor';
        const timeout = 5000; // 5 seconds (consider making this configurable)

        // **CRUCIAL:** Use the host path for the docker run volume mount
        const volumeMount = `"${hostCodeDir}:/app"`; // Mount the specific submission directory on the host to /app in the inner container

        // Command to run inside the inner container
        // Ensure the script name matches what you wrote (codeFile)
        // Added error redirection `2>&1` to capture stderr in stdout
        const innerCommand = `bash -c "ls -la /app && echo '---RUNNING SCRIPT---' && python3 /app/${codeFile} < /app/input.txt 2>&1"`;
        const dockerCmd = `
            docker run --rm \
            -v ${volumeMount} \
            --memory="256m" \
            --cpus="0.5" \
            --network="none" \
            -w /app \
            ${image} ${innerCommand}
        `.trim().replace(/\s+/g, ' '); // Clean up whitespace

        console.log(`Executing Docker command: ${dockerCmd}`);

        // Execute the docker command
        exec(dockerCmd, { timeout }, async (error, stdout, stderr) => {
            // Note: With `2>&1` in bash -c, stderr content will likely be in stdout
            let result = {};
            if (error) {
                console.error(`Inner container exec error: ${error}`);
                console.error(`Inner container stderr: ${stderr}`); // May be empty if redirected
                console.log(`Inner container stdout (potential error): ${stdout}`); // Check stdout too
                if (error.killed) {
                    result = { status: 'timeout', error: 'Time Limit Exceeded', stdout: stdout, stderr: stderr };
                } else {
                    // Try to grab error from stdout if stderr is empty due to redirection
                    result = { status: 'error', error: `Execution Failed: ${stderr || stdout || error.message}`, stdout: stdout, stderr: stderr };
                }
            } else {
                const output = stdout.trim();
                console.log(`Inner container execution successful. Raw stdout:\n${output}`);
                // You might want to parse the output based on the delimiters you added (---INPUT---, ---RUNNING---)
                result = {
                    status: 'success',
                    output: output, // Adjust parsing as needed
                    testCaseResult: testCase.expectedOutput !== null && testCase.expectedOutput !== undefined
                        ? { passed: output.endsWith(testCase.expectedOutput.trim()), expected: testCase.expectedOutput.trim() } // Basic check, refine this
                        : null,
                };
            }

            console.log("Sending response:", result);
            res.json(result);

            // Clean up the directory using the path INSIDE the container
            try {
                console.log(`Cleaning up directory: ${containerCodeDir}`);
                await fs.rm(containerCodeDir, { recursive: true, force: true });
                console.log(`Successfully cleaned up ${containerCodeDir}`);
            } catch (cleanupError) {
                console.error(`Error cleaning up directory ${containerCodeDir}: ${cleanupError}`);
            }
        });

    } catch (err) {
        console.error(`Error during submission processing: ${err.stack}`);
        res.status(500).json({ status: 'error', error: 'Internal Server Error', details: err.message });

        // Attempt cleanup even if there was an error before exec
        if (containerCodeDir) {
            try {
                await fs.rm(containerCodeDir, { recursive: true, force: true });
                console.log(`Cleaned up ${containerCodeDir} after error.`);
            } catch (cleanupError) {
                console.error(`Error cleaning up directory ${containerCodeDir} after error: ${cleanupError}`);
            }
        }
    }
});



export default app;