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

// Path INSIDE the outer container where Node writes files
const CONTAINER_SUBMISSION_DIR = '/submissions';
// Path ON THE HOST machine, passed via environment variable
// Host Dir That Mount to Node Container For Submission
const HOST_SUBMISSION_DIR = process.env.HOST_SUBMISSION_DIR;

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

function executeDockerCommand(dockerCmd, timeout) {
    return new Promise((resolve) => {
        exec(dockerCmd, { timeout }, (error, stdout, stderr) => {
            // Always resolve, let the caller handle the error object
            resolve({ error, stdout, stderr });
        });
    });
}


// --- Helper function to parse output ---
function parseOutput(stdout, language) {
    const lines = stdout.trim().split('\n');
    const runMarker = language === 'cpp' ? '---RUNNING---' : '---RUNNING SCRIPT---';
    const compileFailMarker = '---COMPILATION FAILED---'; // Specific to C++ potential failure

    // Find index of the run marker
    const runMarkerIndex = lines.findIndex(line => line.includes(runMarker));
    // Find index of compile failure marker
    const compileFailIndex = lines.findIndex(line => line.includes(compileFailMarker));

    if (compileFailIndex !== -1) {
        // If compilation failed, the relevant output is often before the marker
        // (g++ error messages)
         return lines.slice(0, compileFailIndex + 1).join('\n').trim(); // Include the marker itself
    }

    if (runMarkerIndex !== -1) {
        // If run marker found, return everything after it
        return lines.slice(runMarkerIndex + 1).join('\n').trim();
    }

    // Fallback: If markers aren't found (e.g., script exits early, or only ls ran),
    // return the whole stdout minus potential initial 'ls' output.
    // This might need refinement based on edge cases.
    const lsMarkerIndex = lines.findIndex(line => line.startsWith('total '));
    if (lsMarkerIndex !== -1 && lines.length > lsMarkerIndex + 1 && lines[lsMarkerIndex + 1].includes('..')) {
         // Try to remove typical 'ls -la' output lines
        const firstRealLineIndex = lines.findIndex((line, index) => index > lsMarkerIndex && !line.startsWith('drwx') && !line.startsWith('-rwx') && !line.startsWith('total'));
         return lines.slice(firstRealLineIndex !== -1 ? firstRealLineIndex : 0).join('\n').trim();
    }

    return stdout.trim(); // Return raw if parsing fails
}


app.post('/api/submit', async (req, res) => {
    const { code, language, testCases } = req.body;

    if (!code || !language || !Array.isArray(testCases)) {
        return res.status(400).json({ error: 'Missing required fields: code, language, testCases (must be an array).' });
    }
    if (testCases.length === 0) {
        // Optionally handle cases with no test cases, maybe return success with empty results
        return res.json({ results: [], message: "No test cases provided." });
    }


    const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const containerCodeDir = path.join(CONTAINER_SUBMISSION_DIR, submissionId);
    const hostCodeDir = path.join(HOST_SUBMISSION_DIR, submissionId);

    let results = []; // Array to store results for each test case

    try {
        // Create directory
        await fs.mkdir(containerCodeDir, { recursive: true, mode: 0o777 });
        console.log(`Created directory: ${containerCodeDir} (Host: ${hostCodeDir})`);

        // Determine code filename and image
        let codeFile = '';
        let image = '';
        if (language === 'python') {
            codeFile = 'script.py';
            image = 'yashsakhareliya/python-executor';
        } else if (language === 'cpp') {
            codeFile = 'script.cpp';
            image = 'yashsakhareliya/cpp-executor'; // Ensure this image has g++
        } else {
            throw new Error(`Unsupported language: ${language}`);
        }
        const codeFilePath = path.join(containerCodeDir, codeFile);
        const inputFilePath = path.join(containerCodeDir, 'input.txt');

        // Write the code file ONCE
        await fs.writeFile(codeFilePath, code, { mode: 0o666 });
        console.log(`Created code file: ${codeFilePath}`);

        // Loop through each test case
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`--- Processing Test Case ${i + 1} ---`);

            // Write the input file for the CURRENT test case
            await fs.writeFile(inputFilePath, testCase.input || '', { mode: 0o666 });
            console.log(`Wrote input file: ${inputFilePath} for test case ${i + 1}`);

            // --- Prepare Docker Command for this test case ---
            const timeout = 5000; // 5 seconds per test case
            const volumeMount = `"${hostCodeDir}:/app"`;

            let innerCommand = '';
            if (language === 'python') {
                innerCommand = `bash -c "ls -la /app && echo '---RUNNING SCRIPT---' && python3 /app/${codeFile} < /app/input.txt 2>&1"`;
            } else if (language === 'cpp') {
                // Compile C++, then run if successful. Capture all output.
                innerCommand = `bash -c "
                    echo '---COMPILING---' &&
                    g++ /app/script.cpp -o /app/executable -O2 -std=c++17 2>&1;
                    if [ $? -eq 0 ]; then
                        echo '---RUNNING---' &&
                        ./app/executable < /app/input.txt 2>&1;
                    else
                        echo '---COMPILATION FAILED---';
                        exit 1;
                    fi
                "`;
                 // Note: The exit 1 helps ensure 'error' is set in exec callback on compile fail.
            }

            const dockerCmd = `
                docker run --rm \
                -v ${volumeMount} \
                --memory="256m" \
                --cpus="0.5" \
                --network="none" \
                -w /app \
                ${image} ${innerCommand}
            `.trim().replace(/\s+/g, ' ');

            console.log(`Executing Docker command for test case ${i + 1}: ${dockerCmd}`);

            // Execute the docker command using the Promise wrapper
            const { error, stdout, stderr } = await executeDockerCommand(dockerCmd, timeout);

            // --- Process result for this test case ---
            let testResult = {
                testCaseNumber: i + 1,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                status: '',
                output: '',
                rawStdout: stdout,
                rawStderr: stderr,
                error: null,
                passed: null
            };

            const parsedStdout = parseOutput(stdout, language); // Use helper to clean output
            testResult.output = parsedStdout;

            if (error) {
                console.error(`Test Case ${i + 1}: Inner container exec error: ${error}`);
                console.log(`Test Case ${i + 1}: Inner container stdout (potential error): ${stdout}`);

                if (error.killed) {
                    testResult.status = 'timeout';
                    testResult.error = 'Time Limit Exceeded';
                } else if (language === 'cpp' && stdout.includes('---COMPILATION FAILED---')) {
                     testResult.status = 'compile_error';
                     testResult.error = `Compilation Failed:\n${parsedStdout}`; // parsedStdout should contain g++ errors here
                     testResult.output = null; // No runtime output if compilation fails
                }
                 else {
                    testResult.status = 'runtime_error';
                     // Attempt to extract a meaningful error message
                    testResult.error = `Execution Failed: ${error.message}\nOutput:\n${parsedStdout}`;
                }
            } else {
                testResult.status = 'success';
                // Compare parsed output with expected output
                if (testCase.expectedOutput !== null && testCase.expectedOutput !== undefined) {
                    // Trim both for consistent comparison
                    testResult.passed = parsedStdout.trim() === testCase.expectedOutput.trim();
                }
            }
            results.push(testResult);
            console.log(`Finished processing Test Case ${i + 1}. Status: ${testResult.status}`);
        } // End of test case loop

        console.log("Sending final results:", results);
        res.json({ results });

    } catch (err) {
        console.error(`Error during submission processing: ${err.stack}`);
        // Ensure results array isn't polluted by partial success before error
        results.push({ status: 'error', error: 'Internal Server Error', details: err.message });
        res.status(500).json({ results }); // Send partial/error results if needed

    } finally {
        // Clean up the submission directory regardless of success or failure
        try {
            console.log(`Cleaning up directory: ${containerCodeDir}`);
            await fs.rm(containerCodeDir, { recursive: true, force: true });
            console.log(`Successfully cleaned up ${containerCodeDir}`);
        } catch (cleanupError) {
            console.error(`Error cleaning up directory ${containerCodeDir}: ${cleanupError}`);
        }
    }
});



export default app;