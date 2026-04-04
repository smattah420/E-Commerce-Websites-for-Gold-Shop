import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const repairProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gold-shop');
    console.log('MongoDB Connected...');

    // 1. Revert Locket Set to Necklaces
    const locketSetId = '69d021ad28ad033cb259ec5a';
    await Product.findByIdAndUpdate(locketSetId, { category: 'Necklaces' });
    console.log('Repaired "Locket Set" category to Necklaces.');

    // 2. Correct Flower Shape Gold Earrings to Earrings
    const earringsId = '69d033e928ad033cb259eca2';
    await Product.findByIdAndUpdate(earringsId, { category: 'Earrings' });
    console.log('Corrected "Flower Shape Gold Earrings" category to Earrings.');

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

repairProducts();
