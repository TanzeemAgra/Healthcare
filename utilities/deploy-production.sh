#!/bin/bash

# Production Deployment Script for Healthcare Solution
# This script prepares and deploys the application to production

echo "🚀 Starting Healthcare Solution Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Stage 1: Pre-deployment checks
print_status "Stage 1: Running pre-deployment checks..."

# Check if we're on the right branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    print_warning "You're not on main/master branch. Current branch: $CURRENT_BRANCH"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled."
        exit 1
    fi
fi

# Check if all files are committed
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes. Please commit all changes before deployment."
    git status --porcelain
    exit 1
fi

print_success "Pre-deployment checks passed!"

# Stage 2: Build and test frontend
print_status "Stage 2: Building and testing frontend..."

cd frontend

# Install dependencies
print_status "Installing frontend dependencies..."
npm install

# Run linting
print_status "Running frontend linting..."
npm run lint

# Build the application
print_status "Building frontend for production..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# Stage 3: Prepare backend
print_status "Stage 3: Preparing backend for deployment..."

cd backend

# Check if requirements.txt exists and install dependencies
if [ -f "requirements.txt" ]; then
    print_status "Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Run Django checks
print_status "Running Django system checks..."
python manage.py check --deploy

if [ $? -eq 0 ]; then
    print_success "Backend checks passed!"
else
    print_error "Backend checks failed!"
    exit 1
fi

cd ..

# Stage 4: Git operations
print_status "Stage 4: Preparing Git repository..."

# Add all changes
git add .

# Check if there are any changes to commit
if git diff-index --quiet HEAD --; then
    print_status "No changes to commit."
else
    # Commit changes
    echo -n "Enter commit message for production deployment: "
    read COMMIT_MESSAGE
    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="Production deployment - $(date +'%Y-%m-%d %H:%M:%S')"
    fi
    
    git commit -m "$COMMIT_MESSAGE"
    print_success "Changes committed!"
fi

# Push to GitHub
print_status "Pushing to GitHub..."
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    print_success "Code pushed to GitHub successfully!"
else
    print_error "Failed to push to GitHub!"
    exit 1
fi

# Stage 5: Deployment instructions
print_success "🎉 Pre-deployment preparation completed!"
echo
print_status "Next steps for manual deployment:"
echo "1. 🚀 Railway Backend Deployment:"
echo "   - Go to https://railway.app/dashboard"
echo "   - Connect your GitHub repository"
echo "   - Deploy the backend using Dockerfile.backend"
echo "   - Set environment variables from .env.production.example"
echo
echo "2. 🌐 Vercel Frontend Deployment:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Import your GitHub repository"
echo "   - Set project root to 'frontend'"
echo "   - Configure environment variables"
echo "   - Deploy!"
echo
echo "3. 🔧 Domain Configuration:"
echo "   - Configure custom domains in Vercel and Railway"
echo "   - Update CORS settings with production URLs"
echo "   - Configure SSL certificates"
echo
print_success "Deployment preparation script completed successfully!"
