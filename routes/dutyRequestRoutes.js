import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import {
  createDutyRequest,
  getAllDutyRequests,
  getMyDutyRequests,
  getDutyRequest,
  reviewDutyRequest,
  updateDutyRequest,
  cancelDutyRequest,
  deleteDutyRequest
} from '../controllers/dutyRequestController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Council member routes
router.post('/', createDutyRequest);
router.get('/my-requests', getMyDutyRequests);
router.get('/:id', getDutyRequest);
router.put('/:id', updateDutyRequest);
router.patch('/:id/cancel', cancelDutyRequest);
router.delete('/:id', deleteDutyRequest);

// Admin routes (specific routes before generic ones)
router.get('/', getAllDutyRequests);
router.patch('/:id/review', reviewDutyRequest);

export default router;
