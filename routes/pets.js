const express = require('express');
const router = express.Router();
const { addPet, updatePet, deletePet, getAllPets,
    getPetById, } = require('../controller/pets');
const upload = require("../middleware/upload");
const petController = require("../controller/pets");


router.post("/", upload.single("image"), petController.addPet);
router.put("/:id", upload.single("image"), petController.updatePet);
router.delete("/:id", petController.deletePet);
router.get("/", petController.getAllPets);
router.get("/:id", petController.getPetById);

module.exports = router;