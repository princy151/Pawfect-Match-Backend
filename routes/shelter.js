// // routes/shelter.js
// const express = require("express");
// const router = express.Router();
// const {
//   register,
//   login,
//   getProfile,
// } = require("../controller/shelter");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/:id", getProfile);

// module.exports = router;


const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  verifyResetToken,

} = require("../controller/shelter");

router.post("/register", register);
router.post("/login", login);
router.get("/:id", getProfile);
router.post("/forgotpassword", forgotPassword);
// router.get('/resetpassword/:resetToken', resetPassword);
router.get("/resetpassword/:token", verifyResetToken); // for validating the token
router.post("/resetpassword/:token", resetPassword);   // for updating password


module.exports = router;
