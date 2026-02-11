const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  packageType: {
    type: String,
    enum: ['1_passage_per_day', 'multiple_passages_per_day', 'half_day_stay', 'full_day_stay'],
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  radiusKm: {
    type: Number,
    default: 5
  },
  requestedDate: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  notes: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['open', 'matched', 'accepted', 'completed', 'cancelled'],
    default: 'open'
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

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
