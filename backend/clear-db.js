const mongoose = require('mongoose')

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect('mongodb://localhost:27017/startup-village-county', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('✅ MongoDB connected successfully')

    // Drop the users collection
    await mongoose.connection.db.collection('users').drop()
    console.log('✅ Users collection dropped')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

clearDatabase()
