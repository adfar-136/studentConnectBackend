import express from 'express';
import {
  getMyParticipation,
  getAllParticipation,
  checkIn,
  checkOut,
  updateParticipation,
  markNoShow,
  getParticipationStats
} from '../controllers/participationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Council member routes
router.get('/my-participation', getMyParticipation);
router.post('/:participationId/check-in', checkIn);
router.post('/:participationId/check-out', checkOut);

// Admin routes
router.get('/', getAllParticipation);
router.get('/stats', getParticipationStats);
router.patch('/:id', updateParticipation);
router.patch('/:id/no-show', markNoShow);

export default router;
