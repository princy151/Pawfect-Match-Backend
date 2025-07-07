const mongoose = require('mongoose');

const adoptionFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  citizenshipImage: {
    type: String, // store image URL or path
    required: true,
  },
  currentAddress: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    required: true,
    trim: true,
  },
  houseNo: {
    type: String,
    required: true,
    trim: true,
  },
  mapImage: {
    type: String, // store image URL or path
    required: true,
  },
  ownPets: {
    type: Boolean,
    required: true,
  },
  ownOrRent: {
    type: String,
    enum: ['Own', 'Rent'],
    required: true,
  },
  raisedBefore: {
    type: Boolean,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String, // can be 'HH:mm' format string or separate fields for hour and minute
    required: true,
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdoptionForm', adoptionFormSchema);
