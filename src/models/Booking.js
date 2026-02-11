const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  scheduledDate: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    default: null
  },
  notes: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
