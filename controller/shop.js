const asyncHandler = require('../middleware/async');
const Product = require('../models/shop');

// @desc    Add a new product
// @route   POST /api/v1/shop
exports.addProduct = asyncHandler(async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, description, discount, isFeatured } = req.body;
    const price = Number(req.body.price);

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields: name or description" });
    }

    if (isNaN(price)) {
      return res.status(400).json({ success: false, message: "Price must be a number" });
    }

    const productData = {
      name,
      description,
      price,
      discount: discount || "0%",
      isFeatured: isFeatured === 'true',
      image: req.file ? req.file.filename : null,
    };

    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: err.message, errors: err.errors });
  }
});

// @desc    Update product
// @route   PUT /api/v1/shop/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, discount, isFeatured } = req.body;
    const price = Number(req.body.price);

    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields: name or description" });
    }

    if (isNaN(price)) {
      return res.status(400).json({ success: false, message: "Price must be a number" });
    }

    const updateData = {
      name,
      description,
      price,
      discount: discount || "0%",
      isFeatured: isFeatured === 'true',
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/v1/shop/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Get all products
// @route   GET /api/v1/shop
exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ success: true, count: products.length, data: products });
});

// @desc    Get single product
// @route   GET /api/v1/shop/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.status(200).json({ success: true, data: product });
});
