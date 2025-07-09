const AdoptionForm = require('../models/adoption');
const asyncHandler = require('../middleware/async');

// @desc    Submit a new adoption form with images
// @route   POST /api/v1/adoption
exports.submitAdoptionForm = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      currentAddress,
      city,
      province,
      houseNo,
      ownPets,
      ownOrRent,
      raisedBefore,
      appointmentDate,
      appointmentTime,
      petId,
    } = req.body;

    // Ensure images are uploaded
    const citizenshipImageFile = req.files?.citizenshipImage?.[0];
    const mapImageFile = req.files?.mapImage?.[0];

    if (
      !name || !email || !phone || !currentAddress || !city || !province || !houseNo ||
      !appointmentDate || !appointmentTime || !petId || !citizenshipImageFile || !mapImageFile
    ) {
      return res.status(400).json({ success: false, message: "Missing required fields or images" });
    }

    const newForm = await AdoptionForm.create({
      name,
      email,
      phone,
      citizenshipImage: citizenshipImageFile.filename,
      currentAddress,
      city,
      province,
      houseNo,
      mapImage: mapImageFile.filename,
      ownPets: ownPets === 'true',
      ownOrRent,
      raisedBefore: raisedBefore === 'true',
      appointmentDate,
      appointmentTime,
      petId,
    });

    res.status(201).json({ success: true, data: newForm });
  } catch (err) {
    console.error('Adoption Form Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Get all adoption forms
// @route   GET /api/v1/adoption
exports.getAllForms = asyncHandler(async (req, res) => {
  const forms = await AdoptionForm.find().populate('petId');
  res.status(200).json({ success: true, data: forms });
});

// @desc    Get a specific form by ID
// @route   GET /api/v1/adoption/:id
exports.getFormById = asyncHandler(async (req, res) => {
  const form = await AdoptionForm.findById(req.params.id).populate('petId');

  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found' });
  }

  res.status(200).json({ success: true, data: form });
});

// @desc    Delete a specific adoption form
// @route   DELETE /api/v1/adoption/:id
exports.deleteForm = asyncHandler(async (req, res) => {
  const form = await AdoptionForm.findByIdAndDelete(req.params.id);

  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found' });
  }

  res.status(200).json({ success: true, message: 'Form deleted successfully' });
});
