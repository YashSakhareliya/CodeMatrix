import express from 'express';
import { 
    registerInstructor, 
    loginInstructor, 
    instructorProfile, 
    logoutInstructor 
} from '../controllers/instructorAuth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerInstructor);
router.post('/login', loginInstructor);

// Protected routes
router.get('/profile', authMiddleware.authInstructor, instructorProfile);
router.get('/logout', authMiddleware.authInstructor, logoutInstructor);

export default router;
