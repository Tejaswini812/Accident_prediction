// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api'
  },
  production: {
    API_BASE_URL: 'https://villagecounty.in/api' // Your actual domain
  }
}

// Get current environment
const environment = import.meta.env.MODE || 'development'

// Check if we're in production based on the actual URL
const isProduction = window.location.hostname === 'villagecounty.in'
const actualEnvironment = isProduction ? 'production' : environment

// Fallback to development if environment is not found
const finalEnvironment = config[actualEnvironment] ? actualEnvironment : 'development'

// Export the appropriate configuration
export const API_BASE_URL = config[finalEnvironment].API_BASE_URL

// Debug logging (only in development)
if (finalEnvironment === 'development') {
  console.log('🔧 API Configuration:', {
    environment: finalEnvironment,
    hostname: window.location.hostname,
    apiBaseUrl: API_BASE_URL
  })
}

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`
}

export default config[finalEnvironment]
