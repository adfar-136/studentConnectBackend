import mongoose from 'mongoose';

const ParticipationSchema = new mongoose.Schema({
  councilMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  duty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Duty',
    required: true
  },
  status: {
    type: String,
    enum: ['assigned', 'confirmed', 'completed', 'no_show', 'cancelled'],
    default: 'assigned'
  },
  checkInTime: {
    type: Date,
    default: null
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  performanceRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    maxlength: [1000, 'Feedback cannot be more than 1000 characters'],
    default: ''
  },
  adminNotes: {
    type: String,
    maxlength: [1000, 'Admin notes cannot be more than 1000 characters'],
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Ensure unique participation per council member per event
ParticipationSchema.index({ councilMember: 1, event: 1 }, { unique: true });

const Participation = mongoose.model('Participation', ParticipationSchema);
export default Participation;
