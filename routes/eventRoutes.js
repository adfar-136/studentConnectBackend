import express from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createEvent);
router.put('/:id', authenticate, authorizeAdmin, updateEvent);
router.delete('/:id', authenticate, authorizeAdmin, deleteEvent);

export default router;