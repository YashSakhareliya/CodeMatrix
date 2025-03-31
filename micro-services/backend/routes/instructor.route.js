import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { joinStudent } from '../controllers/instructor.controller.js';

const router = express.Router();


router.post('/join', authMiddleware.authInstructor, joinStudent)

export default router;