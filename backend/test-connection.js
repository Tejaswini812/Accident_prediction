const axios = require('axios')

async function testConnection() {
  try {
    console.log('Testing server connection...')
    
    const response = await axios.get('http://localhost:5000/api/auth/verify')
    console.log('✅ Server is running:', response.status)
  } catch (error) {
    console.error('❌ Connection error:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Message:', error.message)
  }
}

testConnection()
