import express from 'express';
import { getAllCouncilMembers, createValidStudentId, listValidStudentIds, raiseQuery, listQueries, replyQuery, forwardQuery } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/council-members', getAllCouncilMembers);

// Protected route for admin to create valid student IDs
router.post('/valid-student-id', authenticate, createValidStudentId);

// Protected route for admin to list valid student IDs
router.get('/valid-student-id', authenticate, listValidStudentIds);

// Student raises a query
router.post('/raise-query', authenticate, raiseQuery);

// Admin lists all queries
router.get('/queries', authenticate, listQueries);

// Admin replies/updates status
router.put('/queries/:id/reply', authenticate, replyQuery);

// Admin forwards query
router.put('/queries/:id/forward', authenticate, forwardQuery);

export default router;