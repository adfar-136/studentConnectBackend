import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  studentId: {
    type: String,
    required: [true, 'Please provide a student ID'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Please provide a department'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Please provide a year'],
    trim: true
  },
  isCouncilMember: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to seed an admin user
UserSchema.statics.seedAdmin = async function({ name, email, password, studentId, department, year }) {
  const existing = await this.findOne({ email });
  if (existing) return existing;
  return this.create({
    name,
    email,
    password,
    studentId,
    department,
    year,
    role: 'admin'
  });
};

const User = mongoose.model('User', UserSchema);

export default User;