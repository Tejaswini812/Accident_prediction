// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  production: {
    API_BASE_URL: 'https://yourdomain.com/api' // Replace with your actual domain
  }
}

// Get current environment
const environment = import.meta.env.MODE || 'development'

// Export the appropriate configuration
export const API_BASE_URL = config[environment].API_BASE_URL

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

export default config[environment]
