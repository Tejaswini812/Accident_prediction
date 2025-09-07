const axios = require('axios')

async function testSignup() {
  try {
    console.log('Testing signup endpoint...')
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test2@example.com',
      phone: '1234567890',
      password: 'password123',
      governmentProofType: 'Aadhaar',
      governmentProofNumber: '123456789012',
      address: JSON.stringify({
        street: 'Test Street',
        city: 'Test City',
        state: 'Test State',
        pincode: '123456',
        country: 'India'
      })
    })
    
    console.log('✅ Signup successful:', response.data)
  } catch (error) {
    console.error('❌ Signup error:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Message:', error.message)
    console.error('Stack:', error.stack)
  }
}

testSignup()
