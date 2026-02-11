const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true
  },
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  status: {
    type: String,
    enum: ['proposed', 'accepted', 'rejected', 'completed'],
    default: 'proposed'
  },
  distanceKm: {
    type: Number,
    default: null
  },
  matchedAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Match', matchSchema);
