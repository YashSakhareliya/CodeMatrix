import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { joinStudent, removeStudent } from '../controllers/instructor.controller.js';

const router = express.Router();


router.post('/join', authMiddleware.authInstructor, joinStudent)
router.post('/remove', authMiddleware.authInstructor, removeStudent)

export default router;