import express from 'express';
import { 
  getAllApplications, 
  getApplicationByStudent, 
  createApplication, 
  updateApplicationStatus, 
  deleteApplication 
} from '../controllers/applicationController.js';

import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Student routes
router.get('/my-application', authenticate, getApplicationByStudent);
router.post('/', authenticate, createApplication);
router.delete('/', authenticate, deleteApplication);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllApplications);
router.put('/:id', authenticate, authorizeAdmin, updateApplicationStatus);

export default router;