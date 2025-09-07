const express = require('express')
const multer = require('multer')
const path = require('path')
const Package = require('../models/Package')
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/packages/')
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

// Create new package
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      destination,
      duration,
      packageType,
      includes,
      excludes,
      itinerary,
      contactInfo
    } = req.body

    const imagePaths = req.files ? req.files.map(file => file.path) : []

    const packageData = new Package({
      title,
      description,
      price: parseInt(price),
      destination,
      duration,
      packageType,
      includes,
      excludes,
      itinerary,
      contactInfo,
      images: imagePaths,
      createdAt: new Date()
    })

    await packageData.save()
    res.status(201).json({ message: 'Package created successfully', package: packageData })
  } catch (error) {
    console.error('Error creating package:', error)
    res.status(500).json({ error: 'Error creating package' })
  }
})

// Get all packages
router.get('/', async (req, res) => {
  try {
    const packages = await Package.find().sort({ createdAt: -1 })
    res.json(packages)
  } catch (error) {
    console.error('Error fetching packages:', error)
    res.status(500).json({ error: 'Error fetching packages' })
  }
})

// Get package by ID
router.get('/:id', async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id)
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' })
    }
    res.json(packageData)
  } catch (error) {
    console.error('Error fetching package:', error)
    res.status(500).json({ error: 'Error fetching package' })
  }
})

// Update package
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const packageData = await Package.findById(req.params.id)
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' })
    }

    const updateData = { ...req.body }
    if (req.files && req.files.length > 0) {
      updateData.images = [...packageData.images, ...req.files.map(file => file.path)]
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    res.json({ message: 'Package updated successfully', package: updatedPackage })
  } catch (error) {
    console.error('Error updating package:', error)
    res.status(500).json({ error: 'Error updating package' })
  }
})

// Delete package
router.delete('/:id', async (req, res) => {
  try {
    const packageData = await Package.findByIdAndDelete(req.params.id)
    if (!packageData) {
      return res.status(404).json({ error: 'Package not found' })
    }
    res.json({ message: 'Package deleted successfully' })
  } catch (error) {
    console.error('Error deleting package:', error)
    res.status(500).json({ error: 'Error deleting package' })
  }
})

module.exports = router