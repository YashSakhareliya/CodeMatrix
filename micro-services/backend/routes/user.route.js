import express from 'express';
import { registerUser, loginUser, userProfile, logoutUser } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/profile',authMiddleware.authUser ,userProfile)
router.get('/logout',authMiddleware.authUser ,logoutUser)

export default router;