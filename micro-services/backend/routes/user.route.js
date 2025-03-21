import express from 'express';
import { registerUser, loginUser, userProfile } from '../controllers/user.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)

router.get('/profile',authMiddleware.authUser ,userProfile)

export default router;