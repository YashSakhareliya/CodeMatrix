import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { joinStudent } from '../controllers/student.controller.js';

const router = express.Router();


router.post('/join', authMiddleware.authStudent, joinStudent)

export default router;