import express from 'express';
import {
  createEventProposal,
  getAllEventProposals,
  getMyEventProposals,
  getEventProposal,
  reviewEventProposal,
  updateEventProposal,
  deleteEventProposal
} from '../controllers/eventProposalController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Council member routes
router.post('/', createEventProposal);
router.get('/my-proposals', getMyEventProposals);

// Admin routes
router.get('/', getAllEventProposals);
router.patch('/:id/review', reviewEventProposal);

// Generic routes (must come after specific routes)
router.get('/:id', getEventProposal);
router.put('/:id', updateEventProposal);
router.delete('/:id', deleteEventProposal);

export default router;
