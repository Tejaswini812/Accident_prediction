const express = require('express')
const Hotel = require('../models/Hotel')

const router = express.Router()

// @route   GET /api/hotels
// @desc    Get all hotels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true })
      .populate('host', 'name userId')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: hotels,
      count: hotels.length
    })
  } catch (error) {
    console.error('Get hotels error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotels'
    })
  }
})

// @route   GET /api/hotels/:id
// @desc    Get single hotel
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('host', 'name userId email phone')
      .populate('reviews.user', 'name userId')

    if (!hotel || !hotel.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      })
    }

    res.json({
      success: true,
      data: hotel
    })
  } catch (error) {
    console.error('Get hotel error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching hotel'
    })
  }
})

// @route   POST /api/hotels
// @desc    Create new hotel
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      type,
      price,
      image,
      description,
      amenities
    } = req.body

    const hotel = new Hotel({
      name,
      location,
      type,
      price,
      image,
      description,
      amenities: amenities || [],
      host: req.user?.id || '64a1b2c3d4e5f6789012345' // Default host for demo
    })

    await hotel.save()

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel
    })
  } catch (error) {
    console.error('Create hotel error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating hotel'
    })
  }
})

// @route   PUT /api/hotels/:id
// @desc    Update hotel
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      })
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Hotel updated successfully',
      data: updatedHotel
    })
  } catch (error) {
    console.error('Update hotel error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating hotel'
    })
  }
})

// @route   DELETE /api/hotels/:id
// @desc    Delete hotel
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found'
      })
    }

    hotel.isActive = false
    await hotel.save()

    res.json({
      success: true,
      message: 'Hotel deleted successfully'
    })
  } catch (error) {
    console.error('Delete hotel error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting hotel'
    })
  }
})

module.exports = router
