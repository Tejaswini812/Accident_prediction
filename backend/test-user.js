const mongoose = require('mongoose')

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: null
  },
  governmentProof: {
    type: {
      type: String,
      enum: ['Aadhaar', 'PAN', 'Passport', 'Driving License'],
      required: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    },
    document: {
      type: String,
      required: false
    }
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  approvalDate: {
    type: Date
  },
  profileImage: {
    type: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: {
      type: String,
      default: 'India'
    }
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

const User = mongoose.model('User', userSchema)

// Test connection and user creation
async function testUser() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect('mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connected successfully')

    // Test user creation
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      governmentProof: {
        type: 'Aadhaar',
        number: '123456789012',
        document: 'test-document.pdf'
      },
      address: {
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'India'
      }
    })

    console.log('Creating test user...')
    await testUser.save()
    console.log('✅ Test user created successfully')

    // Clean up
    await User.deleteOne({ email: 'test@example.com' })
    console.log('✅ Test user deleted')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

testUser()
