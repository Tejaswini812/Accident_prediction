#!/bin/bash

# Remove Main Branch and Keep Only Master Branch
# This script helps you remove the main branch from GitHub and keep only master

echo "🗑️ Removing main branch and keeping only master branch..."

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

# Make sure we're on master branch
if [ "$current_branch" != "master" ]; then
    print_warning "Switching to master branch..."
    git checkout master
fi

# Check if there are uncommitted changes
if ! git diff --quiet || ! git diff --cached --quiet; then
    print_warning "You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Update project before removing main branch"
fi

# Push master branch to ensure it's up to date
print_status "Pushing master branch to GitHub..."
git push origin master

# Check if main branch exists remotely
print_status "Checking for main branch on remote..."
if git ls-remote --heads origin main | grep -q main; then
    print_warning "Main branch exists on remote. Removing it..."
    
    # Delete main branch from remote
    git push origin --delete main
    
    if [ $? -eq 0 ]; then
        print_status "✅ Successfully deleted main branch from remote"
    else
        print_error "Failed to delete main branch from remote"
        print_error "You may need to delete it manually from GitHub web interface"
    fi
else
    print_status "Main branch does not exist on remote"
fi

# Check if main branch exists locally
if git show-ref --verify --quiet refs/heads/main; then
    print_warning "Main branch exists locally. Removing it..."
    git branch -d main
    
    if [ $? -eq 0 ]; then
        print_status "✅ Successfully deleted local main branch"
    else
        print_warning "Could not delete local main branch (it may have unmerged changes)"
        print_warning "Force deleting with: git branch -D main"
        git branch -D main
    fi
else
    print_status "Main branch does not exist locally"
fi

# Set master as the default branch (this needs to be done on GitHub)
print_status "Setting master as the default branch..."
print_warning "IMPORTANT: You need to set master as the default branch on GitHub:"
print_warning "1. Go to your GitHub repository: https://github.com/Tejaswini812/startup-village-chatbot"
print_warning "2. Click on 'Settings' tab"
print_warning "3. Click on 'Branches' in the left sidebar"
print_warning "4. Under 'Default branch', click the switch icon"
print_warning "5. Select 'master' as the default branch"
print_warning "6. Click 'Update' and confirm"

# Clean up remote references
print_status "Cleaning up remote references..."
git remote prune origin

# Show final status
echo ""
print_status "🎉 Main branch removal completed!"
print_status "Current branches:"
git branch -a

echo ""
print_status "Next steps:"
print_status "1. Set master as default branch on GitHub (see instructions above)"
print_status "2. Your repository will now only have the master branch"
print_status "3. All future pushes should go to master branch"
print_status "4. GitHub Actions will deploy from master branch"

echo ""
print_warning "If you still see main branch on GitHub after running this script:"
print_warning "1. Go to GitHub repository settings"
print_warning "2. Delete the main branch manually from the web interface"
print_warning "3. Set master as the default branch"
