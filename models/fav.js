const mongoose = require("mongoose");

const favouriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

favouriteSchema.index({ userId: 1, petId: 1 }, { unique: true }); // Prevent duplicate favorites

module.exports = mongoose.model("Favourite", favouriteSchema);
