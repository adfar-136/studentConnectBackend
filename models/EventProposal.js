import mongoose from 'mongoose';

const EventProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an event title'],
    trim: true,
    maxlength: [100, 'Event title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide an event description'],
    trim: true,
    maxlength: [1000, 'Event description cannot be more than 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Please provide an event location'],
    trim: true
  },
  proposedDate: {
    type: Date,
    required: [true, 'Please provide a proposed event date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time']
  },
  expectedAttendees: {
    type: Number,
    required: [true, 'Please provide expected number of attendees']
  },
  budget: {
    type: String,
    trim: true,
    default: 'Not specified'
  },
  resources: {
    type: String,
    trim: true,
    default: 'Not specified'
  },
  proposer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide proposer information']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  adminFeedback: {
    type: String,
    default: ''
  },
  adminResponseDate: {
    type: Date,
    default: null
  },
  adminResponder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const EventProposal = mongoose.model('EventProposal', EventProposalSchema);
export default EventProposal;
