import Order from "../models/Order.js";

// Create Order
export const createOrder = async (req, res) => {
  console.log("Incoming order request body:", JSON.stringify(req.body, null, 2));
  try {
    const order = await Order.create(req.body);
    console.log("Order created successfully:", order);
    res.status(201).json(order);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};