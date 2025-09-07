const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
  make: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    required: true,
    min: 1990,
    max: 2024
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  mileage: {
    type: Number,
    required: true,
    min: 0
  },
  fuelType: {
    type: String,
    required: true,
    enum: ['petrol', 'diesel', 'cng', 'electric', 'hybrid']
  },
  transmission: {
    type: String,
    required: true,
    enum: ['manual', 'automatic', 'cvt']
  },
  color: {
    type: String,
    required: true,
    trim: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['excellent', 'good', 'fair', 'poor']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  seller: {
    type: String,
    required: true,
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
carSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('Car', carSchema)