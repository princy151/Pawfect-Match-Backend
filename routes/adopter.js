// routes/adopter.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,
  getProfileByEmail,
  updateProfile
} = require("../controller/adopter");

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getProfile);
router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:token", verifyResetToken);
router.post("/resetpassword/:token", resetPassword);
router.get("/profile/email/:email", getProfileByEmail);
router.put("/update/:id", updateProfile);

module.exports = router;
