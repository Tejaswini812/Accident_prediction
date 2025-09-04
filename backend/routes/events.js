const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for event images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/events';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Create new event
router.post('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      dateTime,
      price,
      capacity,
      contactInfo,
      requirements
    } = req.body;

    const event = new Event({
      organizer: req.user.userId,
      title,
      description,
      category,
      location: JSON.parse(location),
      dateTime: JSON.parse(dateTime),
      price: parseFloat(price) || 0,
      capacity: parseInt(capacity),
      images: req.files ? req.files.map(file => file.path) : [],
      contactInfo: contactInfo ? JSON.parse(contactInfo) : {},
      requirements: requirements ? JSON.parse(requirements) : []
    });

    await event.save();

    // Add event to user's events array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { events: event._id } }
    );

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: 'Event creation failed', error: error.message });
  }
});

// Get user's events
router.get('/my-events', authenticateToken, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.userId })
      .sort({ 'dateTime.start': -1 });

    res.json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// Get all approved events (for public viewing)
router.get('/', async (req, res) => {
  try {
    const { category, city, minPrice, maxPrice, date, page = 1, limit = 10 } = req.query;
    
    const filter = { isApproved: true, isActive: true };
    
    if (category) filter.category = category;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter['dateTime.start'] = { $gte: startDate, $lt: endDate };
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email phone')
      .sort({ 'dateTime.start': 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
});

// Update event
router.put('/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organizer: req.user.userId 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    const updateData = { ...req.body };
    
    // Handle location update
    if (updateData.location) {
      updateData.location = JSON.parse(updateData.location);
    }
    
    // Handle dateTime update
    if (updateData.dateTime) {
      updateData.dateTime = JSON.parse(updateData.dateTime);
    }
    
    // Handle contact info update
    if (updateData.contactInfo) {
      updateData.contactInfo = JSON.parse(updateData.contactInfo);
    }
    
    // Handle requirements update
    if (updateData.requirements) {
      updateData.requirements = JSON.parse(updateData.requirements);
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      updateData.images = [...event.images, ...req.files.map(file => file.path)];
    }

    updateData.updatedAt = new Date();

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({ message: 'Event update failed', error: error.message });
  }
});

// Delete event
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organizer: req.user.userId 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    // Delete associated images
    event.images.forEach(imagePath => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Event.findByIdAndDelete(req.params.id);

    // Remove event from user's events array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { events: req.params.id } }
    );

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Event deletion error:', error);
    res.status(500).json({ message: 'Event deletion failed', error: error.message });
  }
});

// Book event (for users to book events)
router.post('/:id/book', authenticateToken, async (req, res) => {
  try {
    const { tickets = 1 } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.isApproved || !event.isActive) {
      return res.status(400).json({ message: 'Event is not available for booking' });
    }

    if (event.currentBookings + tickets > event.capacity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    event.currentBookings += tickets;
    await event.save();

    res.json({ message: 'Event booked successfully', event });
  } catch (error) {
    console.error('Event booking error:', error);
    res.status(500).json({ message: 'Event booking failed', error: error.message });
  }
});

module.exports = router;