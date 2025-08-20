import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a student']
  },
  motivation: {
    type: String,
    required: [true, 'Please provide a motivation'],
    trim: true,
    maxlength: [1000, 'Motivation cannot be more than 1000 characters']
  },
  experience: {
    type: String,
    trim: true,
    maxlength: [1000, 'Experience cannot be more than 1000 characters']
  },
  skills: {
    type: [String],
    default: []
  },
  position: {
    type: String,
    required: [true, 'Please provide a position'],
    enum: ['president', 'vice-president', 'secretary', 'treasurer', 'member'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewComments: {
    type: String,
    default: ''
  },
  interests: {
    type: [String],
    required: [true, 'Please provide interests'],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Application = mongoose.model('Application', ApplicationSchema);

export default Application;