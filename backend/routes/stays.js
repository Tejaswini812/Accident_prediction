const express = require('express');
const router = express.Router();

// Sample stays data
const sampleStays = [
  {
    id: 1,
    name: "Luxury Villa in Goa",
    location: "North Goa",
    price: "₹8,500/night",
    rating: 4.8,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    image: "https://villagecounty.in/image1.png",
    description: "Beautiful beachfront villa with private pool",
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Beach Access"],
    host: "Rajesh Kumar"
  },
  {
    id: 2,
    name: "Mountain Cabin in Manali",
    location: "Manali, Himachal Pradesh",
    price: "₹4,200/night",
    rating: 4.6,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    image: "https://villagecounty.in/image2.png",
    description: "Cozy cabin with mountain views and fireplace",
    amenities: ["WiFi", "Fireplace", "Kitchen", "Parking", "Mountain View"],
    host: "Priya Sharma"
  },
  {
    id: 3,
    name: "Heritage Haveli in Jaipur",
    location: "Pink City, Jaipur",
    price: "₹6,800/night",
    rating: 4.9,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    image: "https://villagecounty.in/image3.png",
    description: "Authentic Rajasthani haveli with traditional architecture",
    amenities: ["WiFi", "Garden", "Kitchen", "Parking", "Cultural Experience"],
    host: "Vikram Singh"
  },
  {
    id: 4,
    name: "Beach House in Kerala",
    location: "Kovalam, Kerala",
    price: "₹5,500/night",
    rating: 4.7,
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    image: "https://villagecounty.in/image1.png",
    description: "Tranquil beach house with Ayurvedic spa services",
    amenities: ["WiFi", "Spa", "Kitchen", "Parking", "Beach Access", "Yoga"],
    host: "Anita Nair"
  },
  {
    id: 5,
    name: "Treehouse in Coorg",
    location: "Coorg, Karnataka",
    price: "₹3,200/night",
    rating: 4.5,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    image: "https://villagecounty.in/image2.png",
    description: "Unique treehouse experience in coffee plantation",
    amenities: ["WiFi", "Nature View", "Coffee Plantation Tour", "Parking"],
    host: "Ravi Gowda"
  }
];

// Get all stays
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      stays: sampleStays,
      total: sampleStays.length
    });
  } catch (error) {
    console.error('Error fetching stays:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stays',
      error: error.message
    });
  }
});

// Get single stay by ID
router.get('/:id', (req, res) => {
  try {
    const stayId = parseInt(req.params.id);
    const stay = sampleStays.find(s => s.id === stayId);
    
    if (!stay) {
      return res.status(404).json({
        success: false,
        message: 'Stay not found'
      });
    }
    
    res.json({
      success: true,
      stay: stay
    });
  } catch (error) {
    console.error('Error fetching stay:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stay',
      error: error.message
    });
  }
});

module.exports = router;

