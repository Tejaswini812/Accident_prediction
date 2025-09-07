const mongoose = require('mongoose')

// Test local MongoDB connection
async function testLocal() {
  try {
    console.log('Connecting to local MongoDB...')
    await mongoose.connect('mongodb://localhost:27017/startup-village-county', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ Local MongoDB connected successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Local MongoDB connection error:', error)
    console.log('Trying to install MongoDB locally...')
    process.exit(1)
  }
}

testLocal()
