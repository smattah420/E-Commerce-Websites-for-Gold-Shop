import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
  },
  items: [{
    productId: String,
    qty: Number,
    purity: String,
    size: String,
  }],
  total: Number,
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  paymentDetails: {
    cardLast4: String,
    transactionRef: String,
  },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);