const axios = require('axios')
const FormData = require('form-data')

async function testEvents() {
  try {
    console.log('Testing events endpoint...')
    
    const formData = new FormData()
    formData.append('title', 'Test Event')
    formData.append('description', 'This is a test event')
    formData.append('price', '100')
    formData.append('location', 'Test Location')
    formData.append('eventType', 'Music')
    formData.append('date', '2024-12-31')
    formData.append('time', '18:00')
    formData.append('duration', '3')
    formData.append('capacity', '100')
    formData.append('organizer', 'Test Organizer')
    formData.append('contactInfo', JSON.stringify({ phone: '1234567890', email: 'test@example.com' }))
    
    const response = await axios.post('http://localhost:5000/api/events', formData, {
      headers: {
        ...formData.getHeaders()
      }
    })
    
    console.log('✅ Event created successfully:', response.data)
  } catch (error) {
    console.error('❌ Event creation error:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    console.error('Message:', error.message)
  }
}

testEvents()
