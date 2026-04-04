import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      existingAdmin.isAdmin = true;
      await existingAdmin.save();
      console.log('Existing user promoted to Admin! ✅');
    } else {
      // Create a default admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        name: 'Initial Admin',
        email: adminEmail,
        password: 'admin123', // User.create will hash it via pre('save') hook
        isAdmin: true,
      });
      console.log('New Admin user created! ✅');
      console.log('Email: admin@example.com');
      console.log('Password: admin123');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
