const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  clientReview: {
    type: String,
    default: null
  },
  clientRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  providerReview: {
    type: String,
    default: null
  },
  providerRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
