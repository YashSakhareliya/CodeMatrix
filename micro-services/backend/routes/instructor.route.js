import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import validateObjectId from '../middleware/validateObjectId.middleware.js';
import { joinStudent, removeStudent, giveAssignment } from '../controllers/instructor.controller.js';

const router = express.Router();


router.post('/join', 
    authMiddleware.authInstructor,
    validateObjectId('instructorId'),
    validateObjectId('studentId'),
    joinStudent)
router.post('/remove', 
    authMiddleware.authInstructor,
    validateObjectId('instructorId'),
    validateObjectId('studentId'), 
    removeStudent)

router.post('/assignment', 
    authMiddleware.authInstructor,
    validateObjectId('instructorId'),
    validateObjectId('groupId'),
    giveAssignment)

export default router;