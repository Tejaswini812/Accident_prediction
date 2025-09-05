# Remove Main Branch and Keep Only Master Branch
# PowerShell version for Windows

Write-Host "🗑️ Removing main branch and keeping only master branch..." -ForegroundColor Green

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Not a git repository. Please run this script from your project directory." -ForegroundColor Red
    exit 1
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "📋 Current branch: $currentBranch" -ForegroundColor Yellow

# Make sure we're on master branch
if ($currentBranch -ne "master") {
    Write-Host "⚠️ Switching to master branch..." -ForegroundColor Yellow
    git checkout master
}

# Check if there are uncommitted changes
$status = git status --porcelain
if ($status) {
    Write-Host "⚠️ You have uncommitted changes. Committing them..." -ForegroundColor Yellow
    git add .
    git commit -m "Update project before removing main branch"
}

# Push master branch to ensure it's up to date
Write-Host "📤 Pushing master branch to GitHub..." -ForegroundColor Green
git push origin master

# Check if main branch exists remotely
Write-Host "🔍 Checking for main branch on remote..." -ForegroundColor Green
$remoteBranches = git ls-remote --heads origin
if ($remoteBranches -match "refs/heads/main") {
    Write-Host "⚠️ Main branch exists on remote. Removing it..." -ForegroundColor Yellow
    
    # Delete main branch from remote
    git push origin --delete main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully deleted main branch from remote" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to delete main branch from remote" -ForegroundColor Red
        Write-Host "You may need to delete it manually from GitHub web interface" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Main branch does not exist on remote" -ForegroundColor Green
}

# Check if main branch exists locally
$localBranches = git branch
if ($localBranches -match "main") {
    Write-Host "⚠️ Main branch exists locally. Removing it..." -ForegroundColor Yellow
    git branch -d main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully deleted local main branch" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Could not delete local main branch (it may have unmerged changes)" -ForegroundColor Yellow
        Write-Host "Force deleting with: git branch -D main" -ForegroundColor Yellow
        git branch -D main
    }
} else {
    Write-Host "✅ Main branch does not exist locally" -ForegroundColor Green
}

# Clean up remote references
Write-Host "🧹 Cleaning up remote references..." -ForegroundColor Green
git remote prune origin

# Show final status
Write-Host ""
Write-Host "🎉 Main branch removal completed!" -ForegroundColor Green
Write-Host "Current branches:" -ForegroundColor Yellow
git branch -a

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Go to your GitHub repository: https://github.com/Tejaswini812/startup-village-chatbot" -ForegroundColor Cyan
Write-Host "2. Click on 'Settings' tab" -ForegroundColor Cyan
Write-Host "3. Click on 'Branches' in the left sidebar" -ForegroundColor Cyan
Write-Host "4. Under 'Default branch', click the switch icon" -ForegroundColor Cyan
Write-Host "5. Select 'master' as the default branch" -ForegroundColor Cyan
Write-Host "6. Click 'Update' and confirm" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ Your repository will now only have the master branch" -ForegroundColor Green
Write-Host "✅ All future pushes should go to master branch" -ForegroundColor Green
Write-Host "✅ GitHub Actions will deploy from master branch" -ForegroundColor Green
