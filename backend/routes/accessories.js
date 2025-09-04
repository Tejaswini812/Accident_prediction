const express = require('express')
const Accessory = require('../models/Accessory')

const router = express.Router()

// @route   GET /api/accessories
// @desc    Get all accessories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const accessories = await Accessory.find({ isActive: true })
      .populate('seller', 'name userId')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: accessories,
      count: accessories.length
    })
  } catch (error) {
    console.error('Get accessories error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching accessories'
    })
  }
})

// @route   GET /api/accessories/:id
// @desc    Get single accessory
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)
      .populate('seller', 'name userId email phone')
      .populate('reviews.user', 'name userId')

    if (!accessory || !accessory.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      })
    }

    res.json({
      success: true,
      data: accessory
    })
  } catch (error) {
    console.error('Get accessory error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching accessory'
    })
  }
})

// @route   POST /api/accessories
// @desc    Create new accessory
// @access  Private
router.post('/', async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      brand,
      condition,
      stock
    } = req.body

    const accessory = new Accessory({
      name,
      price,
      description,
      image,
      category,
      brand,
      condition,
      stock,
      seller: req.user?.id || '64a1b2c3d4e5f6789012345' // Default seller for demo
    })

    await accessory.save()

    res.status(201).json({
      success: true,
      message: 'Accessory created successfully',
      data: accessory
    })
  } catch (error) {
    console.error('Create accessory error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while creating accessory'
    })
  }
})

// @route   PUT /api/accessories/:id
// @desc    Update accessory
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      })
    }

    const updatedAccessory = await Accessory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Accessory updated successfully',
      data: updatedAccessory
    })
  } catch (error) {
    console.error('Update accessory error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating accessory'
    })
  }
})

// @route   DELETE /api/accessories/:id
// @desc    Delete accessory
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const accessory = await Accessory.findById(req.params.id)

    if (!accessory) {
      return res.status(404).json({
        success: false,
        message: 'Accessory not found'
      })
    }

    accessory.isActive = false
    await accessory.save()

    res.json({
      success: true,
      message: 'Accessory deleted successfully'
    })
  } catch (error) {
    console.error('Delete accessory error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting accessory'
    })
  }
})

module.exports = router
