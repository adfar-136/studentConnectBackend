import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/iust_portal';

async function seedAdmin() {
  try {
    await mongoose.connect(mongoUri);
    const admin = await User.seedAdmin({
      name: 'Admin User',
      email: 'adfarrasheed136@gmail.com',
      password: 'admin123', // You can change this password
      studentId: 'ADMIN001',
      department: 'Administration',
      year: 'N/A'
    });
    console.log('Admin user seeded:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Seeding admin failed:', err);
    process.exit(1);
  }
}

seedAdmin(); 