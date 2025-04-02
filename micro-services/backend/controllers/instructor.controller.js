import dashboardModel from "../models/dashboard.model.js";
import studentModel from "../models/student.model.js";
import instructorModel from "../models/instructor.model.js";

const joinStudent = async (req, res) => {
    const { instructorId, studentId } = req.body;
    const loginInstructorId = req.instructor._id.toString();
    if(!instructorId || !studentId){
        return res.status(404).json({message: "Missing Filed - required both filed"})
    }
    
    // if request made by another instructor who current not login then access is denied
    if(instructorId !== loginInstructorId){
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

}


export { joinStudent };