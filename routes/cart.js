const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require('../controller/cart');

// Get cart by customer ID
router.get('/:customerId', getCart);

// Add or update product quantity
router.post('/:customerId/add', addToCart);

// Remove product from cart
router.delete('/:customerId/remove/:productId', removeFromCart);

// Clear entire cart
router.delete('/:customerId/clear', clearCart);

module.exports = router;
