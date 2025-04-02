import studentModel from "../models/student.model.js";
import instructorModel from "../models/instructor.model.js";

const createStudent = async ({
    name,
    email,
    password
}) => {
    if(!name || !email || !password){
        throw new Error("All fields are required");
    }

    const student = new studentModel({name, email, password});
    await student.save();
    return student;
}

const createInstructor = async ({
    name,
    email,
    password
}) => {
    if(!name || !email || !password){
        throw new Error("All fields are required");
    }

    const instructor = await instructorModel.create({
        name,
        email,
        password,
        students: []
    });
    return instructor;
}

export default { createStudent, createInstructor };