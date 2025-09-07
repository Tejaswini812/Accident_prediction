const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 5001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/documents'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log('File received:', file.fieldname, file.originalname, file.mimetype)
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      console.log('File rejected:', file.originalname, file.mimetype)
      cb(new Error('Only images and PDF files are allowed'), false)
    }
  }
})

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is running!' })
})

// Test upload route
app.post('/test-upload', upload.single('document'), (req, res) => {
  console.log('Test upload received:', req.body)
  console.log('File:', req.file)
  res.json({ message: 'Upload successful', file: req.file })
})

// MongoDB connection
const mongoURI = 'mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err)
})

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`)
})