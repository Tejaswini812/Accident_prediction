#!/bin/bash

# Deploy to Hostinger VPS
# This script deploys your project to Hostinger VPS

echo "🚀 Deploying to Hostinger VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Push to GitHub
print_status "Pushing to GitHub..."
git add .
git commit -m "Deploy to production - $(date)"
git push origin master

if [ $? -eq 0 ]; then
    print_status "✅ Successfully pushed to GitHub"
else
    print_error "Failed to push to GitHub"
    exit 1
fi

# Step 2: Deploy to Hostinger VPS
print_status "Deploying to Hostinger VPS..."

# SSH into your VPS and run deployment commands
ssh root@31.97.233.176 << 'EOF'
cd /root/startup-village-county
git pull origin master
npm run install:all
npm run build
pm2 restart startup-village-backend
sudo systemctl restart nginx
echo "✅ Deployment completed on VPS"
EOF

if [ $? -eq 0 ]; then
    print_status "✅ Successfully deployed to Hostinger VPS"
else
    print_error "Failed to deploy to Hostinger VPS"
    exit 1
fi

# Step 3: Verify deployment
print_status "Verifying deployment..."

# Check if site is accessible
if curl -f http://31.97.233.176 > /dev/null 2>&1; then
    print_status "✅ Site is accessible at http://31.97.233.176"
else
    print_warning "⚠️ Site might not be accessible at http://31.97.233.176"
fi

if curl -f https://villagecounty.in > /dev/null 2>&1; then
    print_status "✅ Domain is accessible at https://villagecounty.in"
else
    print_warning "⚠️ Domain might not be accessible at https://villagecounty.in"
fi

print_status "🎉 Deployment completed!"
print_status "Your site should now be live at:"
print_status "- IP: http://31.97.233.176"
print_status "- Domain: https://villagecounty.in"
