import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Read CSV data
const readUserData = () => {
  try {
    // Try multiple possible paths for the CSV file
    const possiblePaths = [
      path.join(__dirname, '../../Chatbot/UserData.csv'),
      path.join(__dirname, '../../../Chatbot/UserData.csv'),
      path.join(process.cwd(), '../Chatbot/UserData.csv'),
      path.join(process.cwd(), 'Chatbot/UserData.csv')
    ]
    
    let csvPath = null
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        csvPath = testPath
        break
      }
    }
    
    if (!csvPath) {
      console.error('CSV file not found. Tried paths:', possiblePaths)
      return []
    }
    
    console.log('Reading CSV from:', csvPath)
    const csvData = fs.readFileSync(csvPath, 'utf8')
    const lines = csvData.split('\n')
    const headers = lines[0].split(',')
    const users = []
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',')
        const user = {}
        headers.forEach((header, index) => {
          user[header.trim()] = values[index] ? values[index].trim() : ''
        })
        users.push(user)
      }
    }
    console.log(`Loaded ${users.length} users from CSV`)
    return users
  } catch (error) {
    console.error('Error reading CSV:', error)
    return []
  }
}

// Test endpoint
app.get('/api/auth/test-csv', (req, res) => {
  try {
    const users = readUserData()
    res.json({
      success: true,
      message: `Found ${users.length} users`,
      users: users.slice(0, 3)
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reading CSV',
      error: error.message
    })
  }
})

// Login endpoint (updated for new auth system)
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      })
    }

    // For demo purposes, accept any email/password combination
    // In production, you'd validate against a database
    const demoUser = {
      id: 'demo-user-1',
      name: 'Demo User',
      email: email,
      phone: '9876543210',
      isApproved: true
    }

    res.json({
      success: true,
      message: 'Login successful',
      token: 'demo-token-' + Date.now(),
      user: demoUser
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// Register endpoint (for new auth system)
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, phone, password } = req.body
    
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    // For demo purposes, always return success
    res.json({
      success: true,
      message: 'Registration successful. Please wait for admin approval.',
      userId: 'demo-user-' + Date.now()
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    })
  }
})

// Profile endpoint (for new auth system)
app.get('/api/auth/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    // For demo purposes, return a demo user profile
    const demoProfile = {
      _id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      phone: '9876543210',
      isApproved: true,
      properties: [],
      events: []
    }

    res.json(demoProfile)

  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    })
  }
})

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      })
    }

    // For now, we'll just validate that it's a dummy token
    if (token.startsWith('dummy-token-')) {
      const userId = token.replace('dummy-token-', '')
      const users = readUserData()
      const user = users.find(u => u.UserID && u.UserID.toUpperCase() === userId.toUpperCase())
      
      if (user) {
        return res.json({
          success: true,
          message: 'Token is valid',
          user: {
            id: user.UserID,
            name: user.Name,
            email: user.Email,
            userId: user.UserID,
            phone: user.Phone,
            whatsapp: user['WhatsApp Link'],
            carNumber: user['Car Number'],
            referralId: user['Referral ID'],
            companyLink: user['Company/LinkedIn Link']
          }
        })
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })

  } catch (error) {
    console.error('Token verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    })
  }
})

// Hotels endpoint
app.get('/api/hotels', (req, res) => {
  const hotels = [
    {
      id: 1,
      name: "Sunset Retreat",
      location: "Goa",
      type: "Cottage",
      price: "₹2500/night",
      image: "/image1.png"
    },
    {
      id: 2,
      name: "Ocean Breeze",
      location: "Goa", 
      type: "Tent",
      price: "₹1500/night",
      image: "/image2.png"
    },
    {
      id: 3,
      name: "Mountain View Resort",
      location: "Coorg",
      type: "Resort",
      price: "₹3500/night",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop"
    },
    {
      id: 4,
      name: "Royal Heritage Palace",
      location: "Mysore",
      type: "Palace",
      price: "₹4500/night",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop"
    },
    {
      id: 5,
      name: "Beachside Villa",
      location: "Kerala",
      type: "Villa",
      price: "₹2800/night",
      image: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1000&h=600&fit=crop"
    }
  ]
  res.json({ data: hotels })
})

// Properties endpoint
app.get('/api/properties', (req, res) => {
  const properties = [
    {
      id: 1,
      price: "₹1.15 Crores",
      area: "1,500 sqft",
      monthlyPayment: "₹7,666",
      image: "/image1.png"
    },
    {
      id: 2,
      price: "₹1.15 Crores", 
      area: "1,500 sqft",
      monthlyPayment: "₹7,666",
      image: "/image2.png"
    }
  ]
  res.json({ data: properties })
})

// Accessories endpoint
app.get('/api/accessories', (req, res) => {
  const accessories = [
    {
      id: 1,
      name: "Shakti Technology High Pressure Washer",
      price: "₹199",
      image: "/image1.png"
    },
    {
      id: 2,
      name: "Shrida Naturals Lemon & Orange Air Freshener",
      price: "₹199", 
      image: "/image2.png"
    },
    {
      id: 3,
      name: "Premium Car Phone Mount",
      price: "₹450",
      image: "/image3.png"
    }
  ]
  res.json({ data: accessories })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Simple Server is running',
    timestamp: new Date().toISOString()
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Simple Server running on port ${PORT}`)
  console.log(`📱 API URL: http://localhost:${PORT}/api`)
})
