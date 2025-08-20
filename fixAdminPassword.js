import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://adfarrasheed136:test@cluster0.zi0u3tx.mongodb.net/studentConnect';

async function fixAdminPassword() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Delete existing admin user to start fresh
    console.log('🗑️ Deleting existing admin user...');
    await User.deleteOne({ email: 'adfarrasheed136@gmail.com' });
    console.log('✅ Existing admin user deleted.');

    // Create new admin user with proper password hashing
    console.log('👤 Creating new admin user...');
    const newAdmin = await User.create({
      name: 'Admin User',
      email: 'adfarrasheed136@gmail.com',
      password: 'admin123',
      studentId: 'ADMIN001',
      department: 'Administration',
      year: 'N/A',
      role: 'admin'
    });
    
    console.log('✅ New admin user created successfully!');
    console.log('Email:', newAdmin.email);
    console.log('Password: admin123');

    // Test the password
    console.log('\n🔐 Testing password...');
    const testAdmin = await User.findOne({ email: 'adfarrasheed136@gmail.com' });
    const isPasswordValid = await testAdmin.comparePassword('admin123');
    
    if (isPasswordValid) {
      console.log('✅ Password test successful! Admin can now login.');
      console.log('\n📋 Admin Login Credentials:');
      console.log('Email: adfarrasheed136@gmail.com');
      console.log('Password: admin123');
    } else {
      console.log('❌ Password test failed. Something went wrong.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin password:', error);
    process.exit(1);
  }
}

// Run the fix
fixAdminPassword();
