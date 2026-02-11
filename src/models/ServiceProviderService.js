const mongoose = require('mongoose');

const serviceProviderServiceSchema = new mongoose.Schema({
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
  pricePerVisit: {
    type: Number,
    default: null
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

// Compound unique index: one provider can't offer the same service+package twice
serviceProviderServiceSchema.index({ serviceProviderId: 1, serviceId: 1, packageType: 1 }, { unique: true });

module.exports = mongoose.model('ServiceProviderService', serviceProviderServiceSchema);
