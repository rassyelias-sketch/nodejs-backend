const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  websiteUrl: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  registeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String, // URL or filename
    default: null
  },
  logo: {
    type: String, // URL or filename
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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

module.exports = mongoose.model('Agency', agencySchema);
