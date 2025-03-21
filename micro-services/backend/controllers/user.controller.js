import userModel from "../models/user.model.js";
import userService from "../services/user.service.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Please provide a valid email address' });
        }

        // find user not registered
        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashPassword = await userModel.hashPassword(password);

        const user = await userService.createUser({ name, email, password: hashPassword });
        const token = user.generateAuthToken();

        res.status(201).json({ user, token });
    } catch (error) {
        console.error('Error in registerUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { registerUser };