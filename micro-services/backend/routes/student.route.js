import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { joinStudent } from '../controllers/student.controller.js';

const router = express.Router();



export default router;