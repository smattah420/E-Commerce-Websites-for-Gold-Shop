import mongoose from 'mongoose'

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Necklaces', 'Earrings', 'Rings', 'Bangles', 'Challa'],
    },
    purity: {
      type: [String],
      required: true,
      enum: ['18k', '22k', '24k'],
    },
    pricePKR: {
      type: Number,
      required: true,
      default: 0,
    },
    compareAtPKR: {
      type: Number,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    badge: {
      type: String,
      enum: ['Best Seller', 'New', 'Limited'],
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model('Product', productSchema)

export default Product
