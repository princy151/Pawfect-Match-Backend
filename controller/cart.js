const Cart = require('../models/cart');
const Product = require('../models/shop');
const asyncHandler = require('../middleware/async');

// @desc    Get cart by customer ID
// @route   GET /api/v1/cart/:customerId
exports.getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ customer: req.params.customerId }).populate('items.product');

  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Add or update product in cart
// @route   POST /api/v1/cart/:customerId/add
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const customerId = req.params.customerId;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ message: 'Product ID and quantity (>=1) required' });
  }

  // Get product price and discount at time of adding
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Find or create cart
  let cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    cart = new Cart({
      customer: customerId,
      items: [],
    });
  }

  // Check if product already in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
  } else {
    // Add new item
    cart.items.push({
      product: productId,
      quantity,
      priceAtTime: product.price,
      discountAtTime: product.discount || "0%",
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Product added/updated in cart',
  });
});

// @desc    Remove product from cart
// @route   DELETE /api/v1/cart/:customerId/remove/:productId
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { customerId, productId } = req.params;

  const cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
    message: 'Product removed from cart',
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/v1/cart/:customerId/clear
exports.clearCart = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  const cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
  });
});
