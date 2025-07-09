const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  priceAtTime: {
    type: Number,
    required: true,
  },
  discountAtTime: {
    type: String,
    default: "0%",
  },
});

const cartSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      unique: true, // One cart per customer
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
