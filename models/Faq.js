import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide a question'],
    trim: true,
    unique: true,
    maxlength: [200, 'Question cannot be more than 200 characters']
  },
  answer: {
    type: String,
    required: [true, 'Please provide an answer'],
    trim: true,
    maxlength: [2000, 'Answer cannot be more than 2000 characters']
  },
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    enum: ['admission', 'hostel', 'faculty', 'examination', 'general'],
    default: 'general'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Faq = mongoose.model('Faq', FaqSchema);

export default Faq;