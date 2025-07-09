const express = require('express');
const router = express.Router();
const adoptionController = require('../controller/adoption');
const upload = require('../middleware/upload');

// Multiple file fields
const multiUpload = upload.fields([
  { name: 'citizenshipImage', maxCount: 1 },
  { name: 'mapImage', maxCount: 1 },
]);

router.post('/', multiUpload, adoptionController.submitAdoptionForm);
router.get('/', adoptionController.getAllForms);
router.get('/:id', adoptionController.getFormById);
router.delete('/:id', adoptionController.deleteForm);

module.exports = router;
