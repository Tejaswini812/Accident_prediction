#!/bin/bash

# Startup Village County - Deployment Script for Hostinger VPS
# This script automates the deployment process

echo "🚀 Starting Startup Village County Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run this script as root"
    exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_status "Node.js already installed: $(node --version)"
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
else
    print_status "PM2 already installed: $(pm2 --version)"
fi

# Install MongoDB if not installed
if ! command -v mongod &> /dev/null; then
    print_status "Installing MongoDB..."
    sudo apt install -y mongodb
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
else
    print_status "MongoDB already installed"
fi

# Install Nginx if not installed
if ! command -v nginx &> /dev/null; then
    print_status "Installing Nginx..."
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    print_status "Nginx already installed"
fi

# Install project dependencies
print_status "Installing project dependencies..."
npm run install:all

# Build frontend
print_status "Building frontend..."
npm run build

# Create logs directory
mkdir -p logs

# Start backend with PM2
print_status "Starting backend with PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Copy built files to web directory
print_status "Copying built files to web directory..."
sudo cp -r dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/

# Configure Nginx
print_status "Configuring Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/startup-village
sudo ln -sf /etc/nginx/sites-available/startup-village /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
print_status "Restarting Nginx..."
sudo systemctl restart nginx

# Create environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    print_warning "Creating environment file..."
    cp backend/env.example backend/.env
    print_warning "Please edit backend/.env with your configuration"
fi

# Set up SSL with Let's Encrypt (optional)
read -p "Do you want to set up SSL with Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Installing Certbot..."
    sudo apt install -y certbot python3-certbot-nginx
    
    read -p "Enter your domain name: " domain
    if [ ! -z "$domain" ]; then
        print_status "Setting up SSL for $domain..."
        sudo certbot --nginx -d $domain --non-interactive --agree-tos --email admin@$domain
    fi
fi

# Final status check
print_status "Checking services..."
echo "Backend status:"
pm2 status

echo "Nginx status:"
sudo systemctl status nginx --no-pager -l

echo "MongoDB status:"
sudo systemctl status mongodb --no-pager -l

print_status "🎉 Deployment completed successfully!"
print_status "Your application should now be accessible at:"
print_status "- Frontend: http://your-domain.com"
print_status "- API: http://your-domain.com/api"
print_status "- Health check: http://your-domain.com/api/health"

print_warning "Don't forget to:"
print_warning "1. Edit backend/.env with your configuration"
print_warning "2. Set up your domain DNS"
print_warning "3. Configure firewall if needed"
print_warning "4. Set up regular backups"

echo "📞 For support: connect01@startupvillagecounty.in"
