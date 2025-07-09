const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: String,
    default: "0%",
    // validate: {
    //   validator: function (v) {
    //     return /^-\d+%$/.test(v); // Example: "-10%"
    //   },
    //   message: props => `${props.value} is not a valid discount format! Use '-10%'`,
    // },
  },
  image: {
    type: String,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Product", productSchema);
