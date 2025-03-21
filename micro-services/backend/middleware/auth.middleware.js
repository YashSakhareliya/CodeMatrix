import userModel from "../models/user.model.js";
import blacklistTokenModel from "../models/blacklistToken.model.js";
import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
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

export default {authUser};