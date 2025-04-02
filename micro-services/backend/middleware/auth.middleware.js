import studentModel from "../models/student.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import jwt from 'jsonwebtoken'
import instructorModel from "../models/instructor.model.js";

const authStudent = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access - No token provided' });
        }

        // Check if token is blacklisted
        const isBlackListed = await blacklistTokenModel.findOne({ token });
        if (isBlackListed) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const student = await studentModel.findById(decode._id);
        
        if (!student) {
            return res.status(401).json({ message: 'Unauthorized access - Not a student' });
        }
        
        req.student = student;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

const authInstructor = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access - No token provided' });
        }

        // Check if token is blacklisted
        const isBlackListed = await blacklistTokenModel.findOne({ token });
        if (isBlackListed) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const instructor = await instructorModel.findById(decode._id);
        
        if (!instructor) {
            return res.status(401).json({ message: 'Unauthorized access - Not an instructor' });
        }
        
        req.instructor = instructor;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export default { authStudent, authInstructor };