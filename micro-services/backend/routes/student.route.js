import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import validateObjectId from '../middleware/validateObjectId.middleware.js';
import { handleSubmit } from '../controllers/student.controller.js'

const router = express.Router();

// student submit Problems 
router.post('/submit', 
    authMiddleware.authStudent,
    validateObjectId('studentId', 'body'),
    validateObjectId('assignmentId', 'body'),
    validateObjectId('instructorId', 'body'),
    validateObjectId('groupId', 'body'),
    handleSubmit
)

export default router;