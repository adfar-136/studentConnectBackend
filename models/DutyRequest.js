import mongoose from 'mongoose';

const DutyRequestSchema = new mongoose.Schema({
  duty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Duty',
    required: [true, 'Please provide duty information']
  },
  requestType: {
    type: String,
    enum: ['role_change', 'cancellation'],
    required: [true, 'Please specify request type']
  },
  currentRole: {
    type: String,
    required: [true, 'Please provide current role']
  },
  requestedRole: {
    type: String,
    required: function() {
      return this.requestType === 'role_change';
    }
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for the request'],
    trim: true,
    maxlength: [500, 'Reason cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    default: '',
    maxlength: [500, 'Admin response cannot be more than 500 characters']
  },
  adminResponder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  responseDate: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const DutyRequest = mongoose.model('DutyRequest', DutyRequestSchema);
export default DutyRequest;
