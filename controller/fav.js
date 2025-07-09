const Favourite = require("../models/fav");

// Add a pet to favourites
exports.addFavourite = async (req, res) => {
  const { userId, petId } = req.body;

  if (!userId || !petId) {
    return res.status(400).json({ message: "userId and petId are required" });
  }

  try {
    const favourite = new Favourite({ userId, petId });
    await favourite.save();
    res.status(201).json({ message: "Added to favourites", data: favourite });
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error for unique index
      return res.status(409).json({ message: "This pet is already in favourites" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

// Remove a pet from favourites
exports.removeFavourite = async (req, res) => {
  const { userId, petId } = req.params;

  try {
    const result = await Favourite.findOneAndDelete({ userId, petId });
    if (!result) {
      return res.status(404).json({ message: "Favourite not found" });
    }
    res.json({ message: "Removed from favourites" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all favourites for a user
exports.getUserFavourites = async (req, res) => {
  const { userId } = req.params;

  try {
    const favourites = await Favourite.find({ userId }).populate("petId");
    res.json({ data: favourites });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
