import userModel from "../models/user.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import jwt from 'jsonwebtoken'
import instructorModel from "../models/instructor.model.js";

const authStudent = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token: token });
    if(isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decode._id);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
}

const authInstructor = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    const isBlackListed = await blacklistTokenModel.findOne({ token: token });
    if(isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const instructor = await instructorModel.findById(decode._id);
        
        if (!instructor) {
            return res.status(401).json({ message: 'Unauthorized access - Not an instructor' });
        }
        
        req.instructor = instructor;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
}

export default { authStudent, authInstructor };