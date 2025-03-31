import userModel from "../models/student.model.js";
import instructorModel from "../models/instructor.model.js";

const createUser = async ({
    name,
    email,
    password
}) => {
    if(!name || !email || !password){
        throw new Error("All fields are required");
    }

    const user = await userModel.create({name, email, password});
    return user;
}

const createInstructor = async ({
    username,
    email,
    password
}) => {
    if(!username || !email || !password){
        throw new Error("All fields are required");
    }

    const instructor = await instructorModel.create({
        username,
        email,
        password,
        students: []
    });
    return instructor;
}

export default { createUser, createInstructor };