import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const fixProduct = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gold-shop');
    console.log('MongoDB Connected...');

    const productId = '69d021ad28ad033cb259ec5a';
    const product = await Product.findById(productId);

    if (product) {
      console.log(`Current Category for "${product.name}": ${product.category}`);
      product.category = 'Earrings';
      await product.save();
      console.log(`Success! Category updated to: ${product.category}`);
    } else {
      console.error('Product not found in database.');
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixProduct();
