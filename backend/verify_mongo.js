import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gold-shop';

async function verify() {
  try {
    console.log(`Connecting to ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected ✅');
    
    // Use the model to count
    const orderSchema = new mongoose.Schema({}, { strict: false });
    const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
    
    const count = await Order.countDocuments();
    console.log(`Total orders in DB: ${count}`);
    
    const latest = await Order.findOne().sort({ createdAt: -1 });
    if (latest) {
      console.log('Latest order:', JSON.stringify(latest, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

verify();
