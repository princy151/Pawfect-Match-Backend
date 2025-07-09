const express = require("express");
const router = express.Router();
const favouriteController = require("../controller/fav");

// Add to favourites
router.post("/", favouriteController.addFavourite);

// Remove from favourites
// Using both userId and petId as params to uniquely identify
router.delete("/:userId/:petId", favouriteController.removeFavourite);

// Get all favourites for a user
router.get("/:userId", favouriteController.getUserFavourites);

module.exports = router;
