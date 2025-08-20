import mongoose from 'mongoose';

const ValidStudentIdSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
}, { timestamps: true });

const ValidStudentId = mongoose.model('ValidStudentId', ValidStudentIdSchema);

export default ValidStudentId; 