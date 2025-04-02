import dashboardModel from "../models/dashboard.model.js";
import studentModel from "../models/student.model.js";
import instructorModel from "../models/instructor.model.js";

const joinStudent = async (req, res) => {
    try {
        const { instructorId, studentId } = req.body;
        const loginInstructorId = req.instructor._id.toString();
        if (!instructorId || !studentId) {
            return res.status(404).json({ message: "Missing Filed - required both filed" })
        }

        // if request made by another instructor who current not login then access is denied
        if (instructorId !== loginInstructorId) {
            return res.status(403).json({ message: 'Unauthorized access - Not an instructor' });
        }
        // instructor not found
        const instructor = await instructorModel.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        // student not found
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        // instructor and student already joined
        const isStudentJoined = instructor.students.includes(studentId);
        if (isStudentJoined) {
            return res.status(400).json({ message: 'Student already joined by this instructor' });
        }

        // if all done then make first student - instructor Dashboard 
        // create dashboard
        const dashboard = await dashboardModel.create({
            instructorId: instructorId,
            studentId: studentId,
            // other dashboard data
        });
        // in student model update in active instructor
        student.activeInstructors.push(instructorId);
        await student.save();
        // instructor model update student
        instructor.students.push(studentId);
        await instructor.save();

        // return Dashboard and Student
        return res.status(200).json({ dashboard, student, instructor });

    } catch (error) {
        console.error('Error in joinStudent:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

const removeStudent = async (req, res) => {
    try {
        const { instructorId, studentId } = req.body;
        const loginInstructorId = req.instructor._id.toString();

        // Check if both IDs are provided
        if (!instructorId || !studentId) {
            return res.status(400).json({ message: "Missing Fields - required both fields" });
        }

        // Verify if the logged-in instructor is making the request
        if (instructorId !== loginInstructorId) {
            return res.status(403).json({ message: 'Unauthorized access - Not the correct instructor' });
        }

        // Check if instructor exists
        const instructor = await instructorModel.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }

        // Check if student exists
        const student = await studentModel.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Verify if the student is actually associated with this instructor
        const isStudentJoined = instructor.students.includes(studentId);
        if (!isStudentJoined) {
            return res.status(400).json({ message: 'Student is not associated with this instructor' });
        }

        // Remove the association from both sides
        // Remove student from instructor's students array
        instructor.students = instructor.students.filter(id => id.toString() !== studentId);
        await instructor.save();

        // Remove instructor from student's activeInstructors array
        student.activeInstructors = student.activeInstructors.filter(id => id.toString() !== instructorId);

        // If this instructor was the current instructor, reset it
        if (student.currentInstructor?.toString() === instructorId) {
            student.currentInstructor = null;
        }
        await student.save();

        // Remove the dashboard
        await dashboardModel.findOneAndDelete({
            instructorId: instructorId,
            studentId: studentId
        });

        return res.status(200).json({
            message: 'Student removed successfully',
            instructor,
            student
        });

    } catch (error) {
        console.error('Error in removeStudent:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

const giveAssignment = async (req, res) => {

}

export { joinStudent, removeStudent, giveAssignment };