#!/bin/bash

echo "🚀 Fixing Image Issues and Deploying to Production..."

# Build the frontend
echo "📦 Building frontend..."
npm run build

# Copy frontend build to nginx directory
echo "📁 Copying frontend build to nginx directory..."
sudo cp -r dist/* /var/www/html/

# Copy backend files
echo "📁 Copying backend files..."
sudo cp -r backend/* /root/startup-village-county/backend/

# Restart PM2
echo "🔄 Restarting PM2..."
pm2 restart startup-village-backend

# Test the API endpoints
echo "🧪 Testing API endpoints..."
echo "Testing /api/health..."
curl -s http://localhost:5001/api/health | head -1

echo "Testing /api/cars..."
curl -s http://localhost:5001/api/cars | head -1

echo "Testing /api/stays..."
curl -s http://localhost:5001/api/stays | head -1

# Test frontend
echo "🧪 Testing frontend..."
curl -s http://31.97.233.176 | head -1

echo "✅ Deployment complete!"
echo "🌐 Frontend: http://31.97.233.176"
echo "🌐 Frontend: https://villagecounty.in"
echo "🔧 API: http://31.97.233.176/api/health"

