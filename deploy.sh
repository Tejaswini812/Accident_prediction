#!/bin/bash

# Startup Village County - Deployment Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build frontend
echo "📦 Building frontend..."
cd startup-village-county
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Frontend build failed"
    exit 1
fi

# Check backend dependencies
echo "🔧 Checking backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependency installation failed"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGODB_URI=mongodb+srv://villagecounty:StartupVillage2025@cluster0.mongodb.net/startup-village-county?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=startup-village-county-super-secret-jwt-key-2025-production
JWT_EXPIRE=7d

# Frontend URL (update with your actual domain)
FRONTEND_URL=https://yourdomain.com
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  .env file already exists"
fi

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to Railway/Render with the .env file"
echo "2. Deploy frontend to Vercel/Netlify"
echo "3. Update FRONTEND_URL in backend .env with your actual domain"
echo "4. Test signup/login to ensure data persistence"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"