import mongoose from 'mongoose';

const DutySchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Please provide an event']
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a student']
  },
  role: {
    type: String,
    required: [true, 'Please provide a role'],
    enum: ['coordinator', 'volunteer', 'registration', 'publicity', 'technical', 'decoration'],
    default: 'volunteer'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'completed'],
    default: 'pending'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an assigner']
  },
  feedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Duty = mongoose.model('Duty', DutySchema);

export default Duty;