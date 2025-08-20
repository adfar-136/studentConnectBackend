import mongoose from 'mongoose';

const QuerySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'forwarded'],
    default: 'open'
  },
  adminReply: {
    type: String,
    default: ''
  },
  forwardedTo: {
    type: String,
    default: ''
  },
  mailForwarded: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Query = mongoose.model('Query', QuerySchema);
export default Query; 