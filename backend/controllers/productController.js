import Product from '../models/Product.js'

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = await Product.find({})
  res.json(products)
}

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await Product.deleteOne({ _id: product._id })
    res.json({ message: 'Product removed' })
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const { 
    name, 
    category, 
    purity, 
    pricePKR, 
    compareAtPKR, 
    image, 
    images, 
    badge, 
    description 
  } = req.body

  const product = new Product({
    name,
    category,
    purity,
    pricePKR,
    compareAtPKR,
    rating: 0,
    reviewsCount: 0,
    image,
    images: images || [image],
    badge,
    description,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
}

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { 
    name, 
    category, 
    purity, 
    pricePKR, 
    compareAtPKR, 
    image, 
    images, 
    badge, 
    description 
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name || product.name
    product.category = category || product.category
    product.purity = purity || product.purity
    product.pricePKR = pricePKR || product.pricePKR
    product.compareAtPKR = compareAtPKR || product.compareAtPKR
    product.image = image || product.image
    product.images = images || product.images
    product.badge = badge || product.badge
    product.description = description || product.description

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
}

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct }
