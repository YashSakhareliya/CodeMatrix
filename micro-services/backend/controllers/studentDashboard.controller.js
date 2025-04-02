import Dashboard from '../models/dashboard.model.js'
import StudentModel from '../models/student.model.js';

const getDashboard = async (req, res) => {
    try {
        const { instructorId } = req.params;
        const studentId = req.student._id.toString();

        // get Dashboard Data
        const dashboardData = await Dashboard.findOne({ instructorId, studentId });

        // Check if dashboard data exists
        if (!dashboardData) {
            return res.status(404).json({
                success: false,
                message: 'Dashboard data not found for the given instructor and student'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Student dashboard data retrieved successfully',
            dashboardData
        });

    } catch (error) {
        console.error('Error fetching student dashboard:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching student dashboard data',
            error: error.message
        });
    }
}

const changeCurrentInstructor = async (req, res) => {
    try {
        const { instructorId } = req.body;
        const studentId = req.student._id.toString();

        // check this instructor Id  is in active Instructors list
        const student = await StudentModel.findByStudentId(studentId);

        if (!student.activeInstructors.includes(instructorId)) {
            return res.status(400).json({
                success: false,
                message: 'Instructor is not an active instructor for this student'
            });
        }

        student.currentInstructor = instructorId;
        await student.save();

        // find those Instructor Dashboard  also
        const dashboard = await Dashboard.find({ instructorId, studentId });

        res.status(200).json({
            success: true,
            message: 'Current instructor updated successfully',
            student,
            dashboard
        });
    }
    catch (err) {
        console.error('Error updating current instructor:', err);
        res.status(500).json({
            success: false,
            message: 'Error updating current instructor',
            error: err.message
        });
    }
}

export { getDashboard, changeCurrentInstructor };