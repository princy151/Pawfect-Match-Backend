const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const shopController = require("../controller/shop");

router.post("/", upload.single("image"), shopController.addProduct);
router.put("/:id", upload.single("image"), shopController.updateProduct);
router.delete("/:id", shopController.deleteProduct);
router.get("/", shopController.getAllProducts);
router.get("/:id", shopController.getProductById);

module.exports = router;
