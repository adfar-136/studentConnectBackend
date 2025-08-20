import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: [true, 'Please provide an event date']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide an organizer']
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  image: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

export default Event;