import dashboardModel from "../models/dashboard.model.js";
import studentModel from "../models/student.model.js";
import instructorModel from "../models/instructor.model.js";
import assignmentModel from "../models/assignment.model.js";
import groupModel from "../models/group.models.js";
import { getStudents } from "../services/assignment.service.js";

const joinStudent = async (req, res) => {
    try {
        const { instructorId, studentId } = req.body;
        const loginInstructorId = req.instructor._id.toString();
        if (!instructorId || !studentId) {
            return res.status(404).json({ message: "Missing Filed - required both filed" });
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

        // Check if this is the instructor's first student
        if (instructor.students.length === 0) {
            // Create a new group named "All Students"
            const group = new groupModel({
                name: "All Students",
                instructorId: instructorId,
                students: [studentId]
            });
            await group.save();
        } else {
            // Add the student to the existing "All Students" group
            const group = await groupModel.findOne({ name: "All Students", instructorId: instructorId });
            if (group) {
                group.students.push(studentId);
                await group.save();
            }
        }

        // Create dashboard
        const dashboard = await dashboardModel.create({
            instructorId: instructorId,
            studentId: studentId,
            groupId: [group._id]
        });

        // Update student and instructor models
        student.activeInstructors.push(instructorId);
        await student.save();
        instructor.students.push(studentId);
        await instructor.save();

        // Return Dashboard and Student
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

        // Remove student from all groups associated with the instructor
        const groups = await groupModel.find({ instructorId });
        for (const group of groups) {
            group.students = group.students.filter(id => id.toString() !== studentId);
            await group.save();
        }

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
    try {
        const { instructorId, groupId, title, description, difficulty, testCases, dueDate, totalTime } = req.body;
        const loginInstructorId = req.instructor._id.toString();

        // Verify if the logged-in instructor is making the request
        if (instructorId !== loginInstructorId) {
            return res.status(403).json({ message: 'Unauthorized access - Not the correct instructor' });
        }

        // Validate all required fields
        if (!title || !difficulty || !testCases || !dueDate || !groupId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if dueDate is in the future
        const currentDate = new Date();
        if (new Date(dueDate) <= currentDate) {
            return res.status(400).json({ message: 'Due date must be in the future' });
        }

        // Get all students based on group ID
        const students = await getStudents(groupId);
        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found in the specified group' });
        }

        // Create and save the assignment
        const assignment = new assignmentModel({
            title,
            description,
            instructorId,
            difficulty,
            testCases,
            students,
            totalTime,
            dueDate
        });
        await assignment.save();

        // Update all student dashboards with the new assignment
        for (const studentId of students) {
            const dashboard = await dashboardModel.findOne({ studentId, instructorId });
            if (dashboard) {
                dashboard.assignments.push(assignment._id);
                dashboard.state.totalTasks += 1;
                await dashboard.save();
            }
        }

        return res.status(201).json({
            message: 'Assignment created and assigned successfully',
            assignment
        });

    } catch (error) {
        console.error('Error in giveAssignment:', error);
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}

export { joinStudent, removeStudent, giveAssignment };