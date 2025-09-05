#!/bin/bash

# GitHub Repository Setup Script for Startup Village County
# This script helps you push your project to GitHub and set up automated deployment

echo "🚀 Setting up GitHub repository for Startup Village County..."

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

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_status "Initializing git repository..."
    git init
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_status "Creating .gitignore file..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# PM2 logs
.pm2/

# Uploads
uploads/
backend/uploads/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Temporary files
*.tmp
*.temp
EOF
else
    print_status ".gitignore already exists"
fi

# Add all files to git
print_status "Adding files to git..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    print_warning "No changes to commit"
else
    # Commit changes
    print_status "Committing changes..."
    git commit -m "Initial commit: Startup Village County project setup"
fi

# Ask for GitHub repository URL
echo ""
print_warning "Before proceeding, make sure you have:"
print_warning "1. Created a GitHub repository"
print_warning "2. Have the repository URL ready"
echo ""

read -p "Enter your GitHub repository URL (e.g., https://github.com/username/startup-village-county.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    print_error "Repository URL is required"
    exit 1
fi

# Add remote origin
print_status "Adding remote origin..."
git remote add origin $REPO_URL 2>/dev/null || git remote set-url origin $REPO_URL

# Push to GitHub
print_status "Pushing to GitHub..."
git branch -M master
git push -u origin master

if [ $? -eq 0 ]; then
    print_status "✅ Successfully pushed to GitHub!"
else
    print_error "Failed to push to GitHub. Please check your repository URL and permissions."
    exit 1
fi

# Show next steps
echo ""
print_status "🎉 GitHub repository setup completed!"
echo ""
print_warning "Next steps for automated deployment:"
print_warning "1. Go to your GitHub repository settings"
print_warning "2. Navigate to Secrets and variables > Actions"
print_warning "3. Add the following secrets:"
print_warning "   - HOSTINGER_HOST: Your VPS IP address"
print_warning "   - HOSTINGER_USERNAME: Your VPS username"
print_warning "   - HOSTINGER_SSH_KEY: Your private SSH key"
print_warning "   - HOSTINGER_PORT: SSH port (usually 22)"
echo ""
print_warning "4. Make sure your VPS has the public SSH key added to authorized_keys"
print_warning "5. Push any changes to trigger automatic deployment"
echo ""
print_status "Your repository is now available at: $REPO_URL"
print_status "GitHub Actions will automatically deploy when you push to the main branch"
