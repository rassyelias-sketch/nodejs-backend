const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  dayOfWeek: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6], // 0 = Sunday, 6 = Saturday
    required: true
  },
  startTime: {
    type: String, // HH:MM format
    required: true
  },
  endTime: {
    type: String, // HH:MM format
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Availability', availabilitySchema);
