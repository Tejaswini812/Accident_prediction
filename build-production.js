// Production build script for Hostinger deployment
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 Starting production build...')

// Step 1: Update API configuration for production
console.log('📝 Updating API configuration for production...')
const apiConfigPath = './src/config/api.js'
let apiConfig = fs.readFileSync(apiConfigPath, 'utf8')

// Replace with your actual domain
const productionDomain = 'https://yourdomain.com' // Change this to your actual domain
apiConfig = apiConfig.replace(
  "API_BASE_URL: 'https://yourdomain.com/api'",
  `API_BASE_URL: '${productionDomain}/api'`
)

fs.writeFileSync(apiConfigPath, apiConfig)
console.log('✅ API configuration updated')

// Step 2: Build React app
console.log('🔨 Building React application...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ React build completed')
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

// Step 3: Create deployment package
console.log('📦 Creating deployment package...')

const distPath = './dist'
const backendPath = './backend'
const deploymentPath = './deployment'

// Create deployment directory
if (fs.existsSync(deploymentPath)) {
  fs.rmSync(deploymentPath, { recursive: true })
}
fs.mkdirSync(deploymentPath)

// Copy backend
console.log('📁 Copying backend files...')
execSync(`xcopy "${backendPath}" "${deploymentPath}\\backend" /E /I /H /Y`, { stdio: 'inherit' })

// Copy frontend build
console.log('📁 Copying frontend build...')
execSync(`xcopy "${distPath}" "${deploymentPath}\\frontend" /E /I /H /Y`, { stdio: 'inherit' })

// Create deployment instructions
const deploymentInstructions = `
# Hostinger Deployment Instructions

## 1. Backend Deployment
1. Upload the 'backend' folder to your Hostinger server
2. SSH into your server and navigate to the backend folder
3. Run: npm install
4. Create a .env file with your production environment variables
5. Run: npm start

## 2. Frontend Deployment
1. Upload the contents of the 'frontend' folder to your public_html directory
2. Update the API_BASE_URL in src/config/api.js to match your domain

## 3. Environment Variables (.env file)
Create this file in your backend directory:

PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-for-production
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CUSTOM_DOMAIN=yourdomain.com
BASE_URL=https://yourdomain.com

## 4. Data Persistence
- All user data is stored in MongoDB Atlas (cloud database)
- All form data is stored in MongoDB collections
- File uploads are stored in the uploads/ directory on your server
- Data persists permanently across deployments

## 5. API Endpoints
Your API will be available at: https://yourdomain.com/api/
- /api/properties
- /api/events
- /api/land-properties
- /api/products
- /api/packages
- /api/cars
- /api/auth/login
- /api/auth/register

## 6. File Structure on Server
/backend/
  ├── server.js
  ├── package.json
  ├── .env
  ├── uploads/
  │   ├── properties/
  │   ├── events/
  │   ├── land-properties/
  │   ├── products/
  │   ├── packages/
  │   └── cars/
  └── ...

/frontend/ (in public_html)
  ├── index.html
  ├── assets/
  └── ...

## 7. Testing
After deployment, test these features:
1. User registration/login
2. Form submission for all 6 features
3. Image uploads
4. Data display on landing page
5. Data persistence after server restart

## 8. Domain Configuration
Update these files with your actual domain:
- src/config/api.js (API_BASE_URL)
- backend/.env (FRONTEND_URL, CUSTOM_DOMAIN, BASE_URL)
`

fs.writeFileSync(path.join(deploymentPath, 'DEPLOYMENT_INSTRUCTIONS.md'), deploymentInstructions)

console.log('✅ Deployment package created in ./deployment/')
console.log('📋 Check DEPLOYMENT_INSTRUCTIONS.md for detailed steps')
console.log('🎉 Production build completed successfully!')
