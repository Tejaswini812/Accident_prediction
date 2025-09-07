const mongoose = require('mongoose')

const landPropertySchema = new mongoose.Schema({
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
  location: {
    type: String,
    required: true,
    trim: true
  },
  landType: {
    type: String,
    required: true,
    enum: ['agricultural', 'residential', 'commercial', 'industrial', 'mixed-use']
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['acres', 'sqft', 'sqm', 'hectares']
  },
  purpose: {
    type: String,
    required: true,
    enum: ['sale', 'lease', 'rent']
  },
  ownership: {
    type: String,
    required: true,
    enum: ['freehold', 'leasehold', 'cooperative']
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
landPropertySchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model('LandProperty', landPropertySchema)
