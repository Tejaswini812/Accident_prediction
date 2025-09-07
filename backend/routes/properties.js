const express = require('express')
const multer = require('multer')
const path = require('path')
const Property = require('../models/Property')
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'), false)
    }
  }
})

// Create new property
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      amenities,
      contactInfo
    } = req.body

    const imagePaths = req.files ? req.files.map(file => file.path) : []

    const property = new Property({
      title,
      description,
      price: parseInt(price),
      location,
      propertyType,
      bedrooms: bedrooms ? parseInt(bedrooms) : 0,
      bathrooms: bathrooms ? parseInt(bathrooms) : 0,
      area: area ? parseInt(area) : 0,
      amenities,
      contactInfo,
      images: imagePaths,
      createdAt: new Date()
    })

    await property.save()
    res.status(201).json({ message: 'Property created successfully', property })
  } catch (error) {
    console.error('Error creating property:', error)
    res.status(500).json({ error: 'Error creating property' })
  }
})

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 })
    res.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    res.status(500).json({ error: 'Error fetching properties' })
  }
})

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    res.status(500).json({ error: 'Error fetching property' })
  }
})

// Update property
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }

    const updateData = { ...req.body }
    if (req.files && req.files.length > 0) {
      updateData.images = [...property.images, ...req.files.map(file => file.path)]
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    res.json({ message: 'Property updated successfully', property: updatedProperty })
  } catch (error) {
    console.error('Error updating property:', error)
    res.status(500).json({ error: 'Error updating property' })
  }
})

// Delete property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id)
    if (!property) {
      return res.status(404).json({ error: 'Property not found' })
    }
    res.json({ message: 'Property deleted successfully' })
  } catch (error) {
    console.error('Error deleting property:', error)
    res.status(500).json({ error: 'Error deleting property' })
  }
})

module.exports = router