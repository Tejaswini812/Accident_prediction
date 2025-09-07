const express = require('express')
const router = express.Router()

// Mock user data for demonstration
const mockUsers = [
  {
    id: 'PS101',
    name: 'John Doe',
    carNumber: 'KA-01-AB-1234',
    phone: '+91-9876543210',
    whatsapp: 'https://wa.me/919876543210',
    email: 'john.doe@example.com',
    chatLink: true,
    privateCall: true
  },
  {
    id: 'PS102',
    name: 'Jane Smith',
    carNumber: 'KA-02-CD-5678',
    phone: '+91-9876543211',
    whatsapp: 'https://wa.me/919876543211',
    email: 'jane.smith@example.com',
    chatLink: true,
    privateCall: true
  },
  {
    id: 'PS103',
    name: 'Mike Johnson',
    carNumber: 'KA-03-EF-9012',
    phone: '+91-9876543212',
    whatsapp: 'https://wa.me/919876543212',
    email: 'mike.johnson@example.com',
    chatLink: true,
    privateCall: true
  },
  {
    id: 'PS104',
    name: 'Sarah Wilson',
    carNumber: 'KA-04-GH-3456',
    phone: '+91-9876543213',
    whatsapp: 'https://wa.me/919876543213',
    email: 'sarah.wilson@example.com',
    chatLink: true,
    privateCall: true
  },
  {
    id: 'PS105',
    name: 'David Brown',
    carNumber: 'KA-05-IJ-7890',
    phone: '+91-9876543214',
    whatsapp: 'https://wa.me/919876543214',
    email: 'david.brown@example.com',
    chatLink: true,
    privateCall: true
  }
]

// Get user by ID
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const user = mockUsers.find(u => u.id === userId.toUpperCase())
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      })
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User found successfully'
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Get all users (for admin purposes)
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockUsers,
      count: mockUsers.length,
      message: 'Users retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Create new user
router.post('/', (req, res) => {
  try {
    const { id, name, carNumber, phone, whatsapp, email } = req.body
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.id === id.toUpperCase())
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this ID already exists',
        error: 'USER_EXISTS'
      })
    }
    
    const newUser = {
      id: id.toUpperCase(),
      name,
      carNumber,
      phone,
      whatsapp: whatsapp || `https://wa.me/${phone.replace(/\D/g, '')}`,
      email,
      chatLink: true,
      privateCall: true
    }
    
    mockUsers.push(newUser)
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Update user
router.put('/:userId', (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body
    
    const userIndex = mockUsers.findIndex(u => u.id === userId.toUpperCase())
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      })
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    
    res.json({
      success: true,
      data: mockUsers[userIndex],
      message: 'User updated successfully'
    })
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

// Delete user
router.delete('/:userId', (req, res) => {
  try {
    const { userId } = req.params
    
    const userIndex = mockUsers.findIndex(u => u.id === userId.toUpperCase())
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      })
    }
    
    const deletedUser = mockUsers.splice(userIndex, 1)[0]
    
    res.json({
      success: true,
      data: deletedUser,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

module.exports = router
