import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import validateObjectId from '../middleware/validateObjectId.middleware.js';
import { getDashboard, changeCurrentInstructor } from '../controllers/studentDashboard.controller.js';

const router = express.Router();


// Get student dashboard route based on instructor ID
router.get('/dashboard/:instructorId', 
    authMiddleware.authStudent,  
    validateObjectId('instructorId', 'params'),
    getDashboard 
);

router.post('/change-currentInstructor', 
    authMiddleware.authStudent,  
    validateObjectId('instructorId', 'body'),
    changeCurrentInstructor
)

export default router;