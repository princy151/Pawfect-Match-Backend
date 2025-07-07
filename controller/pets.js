const asyncHandler = require('../middleware/async');
const Pet = require('../models/pets');

// @desc    Add a new pet
// @route   POST /api/v1/pets
exports.addPet = asyncHandler(async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const age = Number(req.body.age);
    if (isNaN(age)) {
      return res.status(400).json({ success: false, message: "Age must be a number" });
    }

    if (
      !req.body.name ||
      !req.body.breed ||
      !req.body.gender ||
      !req.body.description
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const petData = {
      name: req.body.name,
      age: age,
      breed: req.body.breed,
      gender: req.body.gender,
      likes: req.body.likes ? req.body.likes.split(",") : [],
      dislikes: req.body.dislikes ? req.body.dislikes.split(",") : [],
      description: req.body.description,
      image: req.file ? req.file.filename : null,
    };

    const pet = await Pet.create(petData);
    res.status(201).json({ success: true, data: pet });
  } catch (err) {
    console.error("Error creating pet:", err);
    res.status(500).json({ success: false, message: err.message, errors: err.errors });
  }
});
// @desc    Update an existing pet
// @route   PUT /api/v1/pets/:id
exports.updatePet = asyncHandler(async (req, res) => {
    const petData = { ...req.body };
    if (req.file) {
        petData.image = req.file.filename;
    }

    const pet = await Pet.findByIdAndUpdate(req.params.id, petData, {
        new: true,
        runValidators: true,
    });

    if (!pet) {
        return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.status(200).json({ success: true, data: pet });
});

// @desc    Delete a pet
// @route   DELETE /api/v1/pets/:id
exports.deletePet = asyncHandler(async (req, res) => {
    const pet = await Pet.findByIdAndDelete(req.params.id);

    if (!pet) {
        return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.status(200).json({
        success: true,
        message: 'Pet deleted successfully',
    });
});

// @desc    Get all pets
// @route   GET /api/v1/pets
exports.getAllPets = asyncHandler(async (req, res) => {
    const pets = await Pet.find();

    res.status(200).json({
        success: true,
        count: pets.length,
        data: pets,
    });
});

// @desc    Get single pet by ID
// @route   GET /api/v1/pets/:id
exports.getPetById = asyncHandler(async (req, res) => {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
        return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    res.status(200).json({
        success: true,
        data: pet,
    });
});
