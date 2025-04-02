import instructorModel from "../models/instructor.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";

const registerInstructor = async (req, res) => {
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

        // Check if instructor already exists
        const instructorExists = await instructorModel.findOne({ email });
        if (instructorExists) {
            return res.status(409).json({ message: 'Instructor already exists' });
        }

        const hashPassword = await instructorModel.hashPassword(password);

        const instructor = await instructorModel.create({ 
            name, 
            email, 
            password: hashPassword,
            students: []
        });

        const token = instructor.generateAuthToken();
        res.status(201).json({ instructor, token });
    } catch (error) {
        console.error('Error in registerInstructor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const loginInstructor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const instructor = await instructorModel.findOne({ email }).select('+password');

        if (!instructor) {
            return res.status(401).json({ message: 'Invalid email' });
        }

        const isMatch = await instructor.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = instructor.generateAuthToken();
        res.cookie('token', token);
        res.status(200).json({ instructor, token });

    } catch (error) {
        console.error('Error in loginInstructor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const logoutInstructor = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (token) {
            await blacklistTokenModel.create({ token: token });
        }
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error in logoutInstructor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const instructorProfile = async (req, res) => {
    try {
        const instructor = req.instructor;
        res.json(instructor);
    } catch (error) {
        console.error('Error in instructorProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { 
    registerInstructor, 
    loginInstructor, 
    instructorProfile, 
    logoutInstructor 
};
