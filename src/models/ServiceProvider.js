const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    default: null
  },
  profilePicture: {
    type: String, // filename or URL
    default: null
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  },
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);
