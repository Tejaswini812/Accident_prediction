const express = require('express')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const Event = require('../models/Event')
const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/events/')
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

// Create new event
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    console.log('=== EVENT CREATION REQUEST ===')
    console.log('Request body:', req.body)
    console.log('Request files:', req.files)
    
    const {
      title,
      description,
      price,
      location,
      eventType,
      date,
      time,
      duration,
      capacity,
      organizer,
      contactInfo
    } = req.body

    console.log('Extracted data:')
    console.log('- title:', title)
    console.log('- eventType:', eventType)
    console.log('- date:', date)
    console.log('- time:', time)

    // Map eventType to category for the model
    const category = eventType
    console.log('- category (mapped):', category)

    const imagePaths = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : []

    const event = new Event({
      title,
      description,
      price: parseFloat(price) || 0,
      category,
      location: {
        venue: location,
        address: location,
        city: location,
        state: location
      },
      dateTime: {
        start: new Date(date + ' ' + time),
        end: new Date(new Date(date + ' ' + time).getTime() + (parseInt(duration) * 60 * 60 * 1000))
      },
      capacity: parseInt(capacity) || 100,
      organizer: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'), // Use a default ObjectId for now
      contactInfo: contactInfo ? JSON.parse(contactInfo) : {},
      images: imagePaths
    })

    await event.save()
    res.status(201).json({ message: 'Event created successfully', event })
  } catch (error) {
    console.error('Error creating event:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    res.status(500).json({ 
      error: 'Error creating event',
      details: error.message 
    })
  }
})

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 })
    res.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ error: 'Error fetching events' })
  }
})

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ error: 'Error fetching event' })
  }
})

// Update event
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }

    const updateData = { ...req.body }
    if (req.files && req.files.length > 0) {
      updateData.images = [...event.images, ...req.files.map(file => file.path)]
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )

    res.json({ message: 'Event updated successfully', event: updatedEvent })
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({ error: 'Error updating event' })
  }
})

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }
    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    res.status(500).json({ error: 'Error deleting event' })
  }
})

module.exports = router