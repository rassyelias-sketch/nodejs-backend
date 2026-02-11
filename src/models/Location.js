const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  serviceProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
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
  postalCode: {
    type: String,
    default: null
  },
  isHomeService: {
    type: Boolean,
    default: true // true = travels to client; false = client comes to them
  },
  isPrimary: {
    type: Boolean,
    default: true // main location
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Location', locationSchema);
