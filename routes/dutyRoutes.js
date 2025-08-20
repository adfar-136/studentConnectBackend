import express from 'express';
import { 
  getAllDuties,
  getDutiesByStudent, 
  getDutiesByEvent, 
  assignDuty, 
  updateDutyStatus, 
  deleteDuty 
} from '../controllers/dutyController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/my-duties', authenticate, getDutiesByStudent);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllDuties);
router.get('/event/:eventId', authenticate, authorizeAdmin, getDutiesByEvent);
router.post('/', authenticate, authorizeAdmin, assignDuty);
router.delete('/:id', authenticate, authorizeAdmin, deleteDuty);

// Student can update their duty status
router.put('/:id', authenticate, updateDutyStatus);

export default router;