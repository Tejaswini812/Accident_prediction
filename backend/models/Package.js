const mongoose = require('mongoose')

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  packageType: {
    type: String,
    required: true,
    enum: ['domestic', 'international', 'adventure', 'leisure', 'business', 'honeymoon', 'family', 'group']
  },
  includes: {
    type: String,
    required: true,
    trim: true
  },
  excludes: {
    type: String,
    trim: true
  },
  itinerary: {
    type: String,
    trim: true
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
packageSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Package', packageSchema)