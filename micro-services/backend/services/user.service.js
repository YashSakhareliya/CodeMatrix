import userModel from "../models/user.model.js";

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

export default { createUser };