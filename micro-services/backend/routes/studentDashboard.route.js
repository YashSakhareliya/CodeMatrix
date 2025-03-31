import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { getDashboard } from '../controllers/studentDashboard.controller.js';

const router = express.Router();


// Get student dashboard route based on instructor ID
router.get('/student-dashboard/:instructorId', 
    authMiddleware.authStudent,  
    getDashboard 
);

export default router;