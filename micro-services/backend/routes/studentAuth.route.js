import express from 'express';
import { registerStudent, loginStudent, studentProfile, logoutStudent } from '../controllers/studentAuth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerStudent)
router.post('/login', loginStudent)

router.get('/profile',authMiddleware.authStudent ,studentProfile)
router.get('/logout',authMiddleware.authStudent ,logoutStudent)

export default router;