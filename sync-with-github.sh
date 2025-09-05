#!/bin/bash

# Sync Local Master Branch with GitHub Repository
# This script helps sync your local master branch with the GitHub repository

echo "🔄 Syncing local master branch with GitHub repository..."

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

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please run this script from your project directory."
    exit 1
fi

# Check current branch
current_branch=$(git branch --show-current)
print_status "Current branch: $current_branch"

if [ "$current_branch" != "master" ]; then
    print_warning "Switching to master branch..."
    git checkout master
fi

# Check if there are uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    print_warning "You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Update project files for deployment"
fi

# Check remote configuration
print_status "Checking remote configuration..."
if ! git remote get-url origin > /dev/null 2>&1; then
    print_error "No remote origin configured. Please set up the remote first:"
    print_error "git remote add origin https://github.com/Tejaswini812/startup-village-chatbot.git"
    exit 1
fi

remote_url=$(git remote get-url origin)
print_status "Remote URL: $remote_url"

# Push to master branch
print_status "Pushing to master branch..."
git push origin master

if [ $? -eq 0 ]; then
    print_status "✅ Successfully synced with GitHub!"
    print_status "Your master branch is now up to date with the remote repository."
else
    print_error "Failed to push to GitHub. This might be because:"
    print_error "1. The remote repository has changes that conflict with yours"
    print_error "2. You don't have write permissions to the repository"
    print_error "3. The remote URL is incorrect"
    echo ""
    print_warning "Try running: git pull origin master --rebase"
    print_warning "Then run this script again"
fi

# Show final status
echo ""
print_status "🎉 Sync completed!"
print_status "Your repository is now available at: $remote_url"
print_status "GitHub Actions will automatically deploy when you push to the master branch"
