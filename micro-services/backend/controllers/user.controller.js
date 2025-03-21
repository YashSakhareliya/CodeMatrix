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
            return res.status(409).json({ message: 'User already exists' });
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

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate email and password
        if (!email ||!password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const user = await userModel.findOne({ email }).select('+password');

        if(!user){
            res.status(401).json({message: 'Invalid email'})
        }

        const isMatch = user.comparePassword(password)

        if(!isMatch){
            res.status(401).json({message: 'Invalid password'})
        }

        const token = user.generateAuthToken();
        res.cookie('token', token);
        res.status(201).json({ user, token });

    }
    catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const userProfile = async (req, res) => {
    try {
        const user = req.user;
        res.json(user);
    } catch (error) {
        console.error('Error in userProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export { registerUser, loginUser, userProfile };