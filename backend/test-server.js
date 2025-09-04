const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Create uploads directory
const uploadDir = 'uploads/documents';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/startup-village-county', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Event Schema
const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, default: 0 },
  category: { type: String, default: 'General' },
  organizer: { type: String, default: 'Unknown' },
  image: { type: String, default: null },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

// Hotel Schema
const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: null },
  description: { type: String, default: '' },
  amenities: { type: [String], default: [] },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Hotel = mongoose.model('Hotel', hotelSchema);

// Accessory Schema
const accessorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String, default: null },
  category: { type: String, default: 'General' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Accessory = mongoose.model('Accessory', accessorySchema);

// Car Schema
const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, default: null },
  description: { type: String, default: '' },
  mileage: { type: String, default: '' },
  fuelType: { type: String, default: '' },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

const Car = mongoose.model('Car', carSchema);

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Test Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required'
      });
    }
    
    // Simulate successful login
    res.json({
      message: 'Login successful',
      token: 'test-token-' + Date.now(),
      user: {
        id: 'test-user-id',
        name: 'Test User',
        email: email,
        phone: '1234567890',
        isApproved: true
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message
    });
  }
});

// Test registration endpoint
app.post('/api/auth/register', upload.fields([
  { name: 'document', maxCount: 1 },
  { name: 'profilePicture', maxCount: 1 }
]), (req, res) => {
  try {
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    
    const { name, email, phone, password, governmentProofType, governmentProofNumber, address } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !password || !governmentProofType || !governmentProofNumber) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { name, email, phone, password: '***', governmentProofType, governmentProofNumber }
      });
    }
    
    if (!req.files || !req.files.document) {
      return res.status(400).json({ 
        message: 'Document file is required',
        received: req.files
      });
    }
    
    // Parse address
    let addressData = {};
    if (address) {
      try {
        addressData = typeof address === 'string' ? JSON.parse(address) : address;
      } catch (error) {
        console.error('Error parsing address:', error);
      }
    }
    
    // Simulate successful registration
    res.status(201).json({ 
      message: 'Registration successful!',
      user: {
        name,
        email,
        phone,
        governmentProofType,
        governmentProofNumber,
        address: addressData,
        documentFile: req.files.document ? req.files.document[0].filename : null,
        profilePictureFile: req.files.profilePicture ? req.files.profilePicture[0].filename : null
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message
    });
  }
});

// Events endpoints

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    console.log('=== GET EVENTS REQUEST ===');
    const events = await Event.find({ status: 'active' }).sort({ createdAt: -1 });
    console.log('Found events:', events.length);
    res.json({
      success: true,
      message: 'Events retrieved successfully',
      events: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
});

// Create new event
app.post('/api/events', upload.single('eventImage'), async (req, res) => {
  try {
    console.log('=== CREATE EVENT REQUEST ===');
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    console.log('File:', req.file);
    console.log('File details:', req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    } : 'No file uploaded');
    
    console.log('FormData entries:');
    for (let [key, value] of Object.entries(req.body)) {
      console.log(`${key}: ${value}`);
    }
    
    const { name, description, date, location, price, category, organizer } = req.body;
    
    if (!name || !description || !date || !location) {
      return res.status(400).json({ 
        message: 'Name, description, date, and location are required'
      });
    }
    
    const imagePath = req.file ? `/uploads/documents/${req.file.filename}` : null;
    console.log('Image path being saved:', imagePath);
    
    const newEvent = new Event({
      name,
      description,
      date,
      location,
      price: price || 0,
      category: category || 'General',
      organizer: organizer || 'Unknown',
      image: imagePath,
      status: 'active'
    });
    
    const savedEvent = await newEvent.save();
    
    console.log('Event created and saved to database:', savedEvent);
    console.log('Saved event image field:', savedEvent.image);
    
    res.status(201).json({ 
      success: true,
      message: 'Event created successfully!',
      event: savedEvent
    });
    
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ 
      message: 'Event creation failed', 
      error: error.message
    });
  }
});

// Get event by ID
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return res.status(404).json({ 
      message: 'Event not found'
    });
  }
  
  res.json({
    message: 'Event retrieved successfully',
    event: event
  });
});

// Hotels endpoints
app.get('/api/hotels', async (req, res) => {
  try {
    console.log('=== GET HOTELS REQUEST ===');
    const hotels = await Hotel.find({ status: 'active' }).sort({ createdAt: -1 });
    console.log('Found hotels:', hotels.length);
    res.json({
      success: true,
      message: 'Hotels retrieved successfully',
      data: hotels
    });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hotels',
      error: error.message
    });
  }
});

app.post('/api/hotels', upload.single('hotelImage'), async (req, res) => {
  try {
    console.log('=== CREATE HOTEL REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { name, location, type, price, description, amenities } = req.body;
    
    if (!name || !location || !type || !price) {
      return res.status(400).json({ 
        message: 'Name, location, type, and price are required'
      });
    }
    
    const imagePath = req.file ? `/uploads/documents/${req.file.filename}` : null;
    console.log('Hotel image path being saved:', imagePath);
    
    const newHotel = new Hotel({
      name,
      location,
      type,
      price: parseFloat(price) || 0,
      description: description || '',
      amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
      image: imagePath,
      status: 'active'
    });
    
    const savedHotel = await newHotel.save();
    
    console.log('Hotel created and saved to database:', savedHotel);
    
    res.status(201).json({
      success: true,
      message: 'Hotel created successfully!',
      data: savedHotel
    });
  } catch (error) {
    console.error('Error creating hotel:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hotel',
      error: error.message
    });
  }
});

// Accessories endpoints
app.get('/api/accessories', async (req, res) => {
  try {
    console.log('=== GET ACCESSORIES REQUEST ===');
    const accessories = await Accessory.find({ status: 'active' }).sort({ createdAt: -1 });
    console.log('Found accessories:', accessories.length);
    res.json({
      success: true,
      message: 'Accessories retrieved successfully',
      data: accessories
    });
  } catch (error) {
    console.error('Error fetching accessories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accessories',
      error: error.message
    });
  }
});

app.post('/api/accessories', upload.single('accessoryImage'), async (req, res) => {
  try {
    console.log('=== CREATE ACCESSORY REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { name, price, description, category } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ 
        message: 'Name and price are required'
      });
    }
    
    const imagePath = req.file ? `/uploads/documents/${req.file.filename}` : null;
    console.log('Accessory image path being saved:', imagePath);
    
    const newAccessory = new Accessory({
      name,
      price,
      description: description || '',
      category: category || 'General',
      image: imagePath,
      status: 'active'
    });
    
    const savedAccessory = await newAccessory.save();
    
    console.log('Accessory created and saved to database:', savedAccessory);
    
    res.status(201).json({
      success: true,
      message: 'Accessory created successfully!',
      data: savedAccessory
    });
  } catch (error) {
    console.error('Error creating accessory:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating accessory',
      error: error.message
    });
  }
});

// Cars endpoints
app.get('/api/cars', async (req, res) => {
  try {
    console.log('=== GET CARS REQUEST ===');
    const cars = await Car.find({ status: 'active' }).sort({ createdAt: -1 });
    console.log('Found cars:', cars.length);
    res.json({
      success: true,
      message: 'Cars retrieved successfully',
      data: cars
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cars',
      error: error.message
    });
  }
});

app.post('/api/cars', upload.single('carImage'), async (req, res) => {
  try {
    console.log('=== CREATE CAR REQUEST ===');
    console.log('Body:', req.body);
    console.log('File:', req.file);
    
    const { name, year, price, description, mileage, fuelType } = req.body;
    
    if (!name || !year || !price) {
      return res.status(400).json({ 
        message: 'Name, year, and price are required'
      });
    }
    
    const imagePath = req.file ? `/uploads/documents/${req.file.filename}` : null;
    console.log('Car image path being saved:', imagePath);
    
    const newCar = new Car({
      name,
      year,
      price,
      description: description || '',
      mileage: mileage || '',
      fuelType: fuelType || '',
      image: imagePath,
      status: 'active'
    });
    
    const savedCar = await newCar.save();
    
    console.log('Car created and saved to database:', savedCar);
    
    res.status(201).json({
      success: true,
      message: 'Car created successfully!',
      data: savedCar
    });
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating car',
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test Server running on port ${PORT}`);
  console.log(`📱 API URL: http://localhost:${PORT}/api`);
});
