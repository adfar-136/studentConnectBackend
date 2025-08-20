import express from 'express';
import { 
  getAllFaqs, 
  getFaqsByCategory, 
  createFaq, 
  updateFaq, 
  deleteFaq 
} from '../controllers/faqController.js';
import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllFaqs);
router.get('/category/:category', getFaqsByCategory);

// Admin routes
router.post('/', authenticate, authorizeAdmin, createFaq);
router.put('/:id', authenticate, authorizeAdmin, updateFaq);
router.delete('/:id', authenticate, authorizeAdmin, deleteFaq);

export default router;