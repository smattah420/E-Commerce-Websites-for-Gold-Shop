import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const promoteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOne({ email: 'admin@example.com' });
    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log('User promoted to Admin successfully');
    } else {
      console.log('User not found');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

promoteUser();
