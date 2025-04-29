import dashboardModel from "../models/dashboard.model.js";
import studentModel from "../models/student.model.js";
import assignmentModel from '../models/assignment.model.js'
import submissionModel from '../models/submission.model.js'
import axios from 'axios';

// Submit Problem to queue
const handleSubmit = async (req, res) => {
    const { studentId, instructorId, assignmentId, groupId, code, language } = req.body;

    const loginStudentId = req.student._id.toString();

    if (!instructorId || !studentId || !assignmentId || !code || !language) {
        return res.status(400).json({ message: "Missing Fields - required all fields" });
    }

    // Verify if the logged-in student is making the request
    if (studentId !== loginStudentId) {
        return res.status(403).json({ message: 'Unauthorized access - Not the correct student' });
    }

    try {
        // Check if assignment exists and this student is assigned to it
        const assignment = await assignmentModel.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        
        if (!assignment.students.includes(studentId)) {
            return res.status(403).json({ message: 'Not assigned to this assignment' });
        }

        // Create a new submission record
        const submission = new submissionModel({
            studentId,
            instructorId,
            assignmentId,
            groupId,
            code,
            language,
            status: 'pending',
            totalTestCases: assignment.testCases.length
        });

        // Save the submission to get its ID
        await submission.save();

        // Add submission reference to the assignment
        assignment.submissions.push(submission._id);
        await assignment.save();

        // Prepare test cases for code execution
        const testCases = assignment.testCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput
        }));

        // Submit to code-executor service
        const codeExecutorUrl = process.env.CODE_EXECUTOR_BASE_URL || 'http://localhost:5000';
        const response = await axios.post(`${codeExecutorUrl}/api/submit`, {
            code,
            language,
            testCases
        });

        // Process the results
        const results = response.data.results;
        let testCasesPassed = 0;
        let status = 'pending';

        // Count passed test cases and determine overall status
        if (results && results.length > 0) {
            testCasesPassed = results.filter(result => result.passed === true).length;
            
            if (testCasesPassed === results.length) {
                status = 'accepted';
            } else if (results.some(result => result.status === 'error' || result.status === 'runtime_error')) {
                status = 'error';
            } else {
                status = 'wrong';
            }
        }

        // Update submission with results
        submission.status = status;
        submission.testCasesPassed = testCasesPassed;
        submission.executionTime = Date.now() - submission.submittedAt.getTime();
        await submission.save();

        // Return the submission with results
        return res.status(200).json({
            message: 'Submission processed successfully',
            submission: {
                _id: submission._id,
                status: submission.status,
                testCasesPassed: submission.testCasesPassed,
                totalTestCases: submission.totalTestCases,
                executionTime: submission.executionTime,
                submittedAt: submission.submittedAt,
                results: results
            }
        });

    } catch (error) {
        console.error('Error in handleSubmit:', error);
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
}

export { handleSubmit };