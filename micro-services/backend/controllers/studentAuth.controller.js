import studentModel from "../models/student.model.js";
import studentService from "../services/user.service.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";

const registerStudent = async (req, res) => {
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

        // find student not registered
        const studentExists = await studentModel.findOne({ email });
        if (studentExists) {
            return res.status(409).json({ message: 'Student already exists' });
        }

        const hashPassword = await studentModel.hashPassword(password);

        const student = await studentService.createStudent({ name, email, password: hashPassword });
        const token = student.generateAuthToken();

        res.status(201).json({ student, token });
    } catch (error) {
        console.error('Error in registerStudent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate email and password
        if (!email ||!password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }
        const student = await studentModel.findOne({ email }).select('+password');

        if(!student){
            res.status(401).json({message: 'Invalid email'})
        }

        const isMatch = student.comparePassword(password)

        if(!isMatch){
            res.status(401).json({message: 'Invalid password'})
        }

        const token = student.generateAuthToken();
        res.cookie('token', token);
        res.status(201).json({ student, token });

    }
    catch (error) {
        console.error('Error in loginStudent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const logoutStudent = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (token) {
            await blacklistTokenModel.create({ token: token });
        }
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error in logoutStudent:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
const studentProfile = async (req, res) => {
    try {
        const student = req.student;
        res.json(student);
    } catch (error) {
        console.error('Error in studentProfile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


export { registerStudent, loginStudent, studentProfile, logoutStudent };