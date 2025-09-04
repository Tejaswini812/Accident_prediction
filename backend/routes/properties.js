const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for property images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/properties';
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

// Create new property
router.post('/', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      location,
      price,
      area,
      bedrooms,
      bathrooms,
      amenities,
      contactInfo
    } = req.body;

    const property = new Property({
      owner: req.user.userId,
      title,
      description,
      type,
      location: JSON.parse(location),
      price: parseFloat(price),
      area: parseFloat(area),
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      amenities: amenities ? JSON.parse(amenities) : [],
      images: req.files ? req.files.map(file => file.path) : [],
      contactInfo: contactInfo ? JSON.parse(contactInfo) : {}
    });

    await property.save();

    // Add property to user's properties array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { properties: property._id } }
    );

    res.status(201).json({ message: 'Property created successfully', property });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(500).json({ message: 'Property creation failed', error: error.message });
  }
});

// Get user's properties
router.get('/my-properties', authenticateToken, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching user properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
});

// Get all approved properties (for public viewing)
router.get('/', async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    const filter = { isApproved: true, isAvailable: true };
    
    if (type) filter.type = type;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Failed to fetch property', error: error.message });
  }
});

// Update property
router.put('/:id', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    const updateData = { ...req.body };
    
    // Handle location update
    if (updateData.location) {
      updateData.location = JSON.parse(updateData.location);
    }
    
    // Handle amenities update
    if (updateData.amenities) {
      updateData.amenities = JSON.parse(updateData.amenities);
    }
    
    // Handle contact info update
    if (updateData.contactInfo) {
      updateData.contactInfo = JSON.parse(updateData.contactInfo);
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      updateData.images = [...property.images, ...req.files.map(file => file.path)];
    }

    updateData.updatedAt = new Date();

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    console.error('Property update error:', error);
    res.status(500).json({ message: 'Property update failed', error: error.message });
  }
});

// Delete property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id, 
      owner: req.user.userId 
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    // Delete associated images
    property.images.forEach(imagePath => {
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Property.findByIdAndDelete(req.params.id);

    // Remove property from user's properties array
    await User.findByIdAndUpdate(
      req.user.userId,
      { $pull: { properties: req.params.id } }
    );

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Property deletion error:', error);
    res.status(500).json({ message: 'Property deletion failed', error: error.message });
  }
});

module.exports = router;