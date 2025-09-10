import { API_BASE_URL } from '../config/api'

// Helper function to create FormData for multipart uploads
const createFormData = (formData, images) => {
  const data = new FormData()
  
  // Add all form fields
  Object.keys(formData).forEach(key => {
    if (formData[key] !== null && formData[key] !== undefined) {
      if (typeof formData[key] === 'object') {
        data.append(key, JSON.stringify(formData[key]))
      } else {
        data.append(key, formData[key])
      }
    }
  })
  
  // Add images
  if (images && images.length > 0) {
    images.forEach((image, index) => {
      data.append('images', image.file)
    })
  }
  
  return data
}

// Property submission (Host a Property -> Find Your Stay)
export const submitProperty = async (formData, images, token) => {
  try {
    // Use multipart endpoint to handle file uploads
    const formDataToSend = createFormData(formData, images)
    
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      method: 'POST',
      body: formDataToSend
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', errorData)
      throw new Error(`Failed to submit property: ${errorData.message || 'Unknown error'}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting property:', error)
    throw error
  }
}

// Land Property submission (Host a Land Property -> Buy & SELL/lease Property)
export const submitLandProperty = async (formData, images, token) => {
  try {
    const data = createFormData(formData, images)
    
    const response = await fetch(`${API_BASE_URL}/land-properties`, {
      method: 'POST',
      body: data
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit land property')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting land property:', error)
    throw error
  }
}

// Event submission
export const submitEvent = async (formData, images, token) => {
  try {
    const data = createFormData(formData, images)
    
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      body: data
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit event')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting event:', error)
    throw error
  }
}

// Product submission
export const submitProduct = async (formData, images, token) => {
  try {
    const data = createFormData(formData, images)
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      body: data
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit product')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting product:', error)
    throw error
  }
}

// Package submission
export const submitPackage = async (formData, images, token) => {
  try {
    const data = createFormData(formData, images)
    
    const response = await fetch(`${API_BASE_URL}/packages`, {
      method: 'POST',
      body: data
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit package')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting package:', error)
    throw error
  }
}

// Car submission
export const submitCar = async (formData, images, token) => {
  try {
    const data = createFormData(formData, images)
    
    const response = await fetch(`${API_BASE_URL}/cars`, {
      method: 'POST',
      body: data
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit car')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting car:', error)
    throw error
  }
}


// Get all submitted forms for display
export const getSubmittedForms = async (token) => {
  try {
    const [properties, events, landProperties, products, packages, cars] = await Promise.all([
      fetch(`${API_BASE_URL}/properties`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/events`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/land-properties`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/products`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/packages`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/cars`).then(res => res.json()).catch(() => [])
    ])

    // Combine all forms with their types
    const allForms = [
      ...properties.map(item => ({ ...item, type: 'property' })),
      ...events.map(item => ({ ...item, type: 'event' })),
      ...landProperties.map(item => ({ ...item, type: 'land' })),
      ...products.map(item => ({ ...item, type: 'product' })),
      ...packages.map(item => ({ ...item, type: 'package' })),
      ...cars.map(item => ({ ...item, type: 'car' }))
    ]

    // Sort by creation date (newest first)
    return allForms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } catch (error) {
    console.error('Error fetching submitted forms:', error)
    return []
  }
}
