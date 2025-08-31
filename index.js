import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import faqRoutes from './routes/faqRoutes.js';
import dutyRoutes from './routes/dutyRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import eventProposalRoutes from './routes/eventProposalRoutes.js';
import dutyRequestRoutes from './routes/dutyRequestRoutes.js';
import participationRoutes from './routes/participationRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:5173',
    'https://iustportal.netlify.app',
    'https://iustsch.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/duties', dutyRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/event-proposals', eventProposalRoutes);
app.use('/api/duty-requests', dutyRequestRoutes);
app.use('/api/participation', participationRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('IUST University Portal API is running');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://adfarrasheed136:test@cluster0.zi0u3tx.mongodb.net/studentConnect';


mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});