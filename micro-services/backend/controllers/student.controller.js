import dashboardModel from "../models/dashboard.model.js";
import studentModel from "../models/student.model.js";
import assignemntModel from '../models/assignment.model.js'
import submissionModel from '../models/submission.model.js'


// Submit Problem to queue
const handleSubmit = (req, res) => {
    const { studentId, instructorId, assignmentId, groupId, code, language } = req.body;

    const loginStudentId = req.student._id.to_string();

    if (!instructorId || !studentId || !assignmentId) {
        return res.status(400).json({ message: "Missing Fields - required all fields" });
    }

    // Verify if the logged-in instructor is making the request
    if (studentId !== loginStudentId) {
        return res.status(403).json({ message: 'Unauthorized access - Not the correct student' });
    }

}

export { handleSubmit };