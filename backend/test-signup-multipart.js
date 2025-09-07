const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

async function testSignupMultipart() {
  try {
    console.log('Testing signup with multipart form data...')
    
    const formData = new FormData()
    formData.append('name', 'Test User')
    formData.append('email', 'test3@example.com')
    formData.append('phone', '1234567890')
    formData.append('password', 'password123')
    formData.append('governmentProofType', 'Aadhaar')
    formData.append('governmentProofNumber', '123456789012')
    formData.append('address', JSON.stringify({
      street: 'Test Street',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      country: 'India'
    }))
    
    // Create a dummy file for testing
    const dummyFile = Buffer.from('dummy file content')
    formData.append('document', dummyFile, {
      filename: 'test-document.pdf',
      contentType: 'application/pdf'
    })
    
    const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
      headers: {
        ...formData.getHeaders()
      }
    })
    
    console.log('✅ Signup successful:', response.data)
  } catch (error) {
    console.error('❌ Signup error:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Message:', error.message)
  }
}

testSignupMultipart()
