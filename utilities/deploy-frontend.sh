#!/bin/bash

# Frontend Deployment Script for Vercel
# Run this script from the project root directory

echo "🚀 Starting Frontend Deployment to Vercel..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found. Please run this script from the project root."
    exit 1
fi

# Navigate to frontend directory
cd frontend

echo "📦 Installing dependencies..."
bun install

echo "🔨 Building the project..."
bun run build

echo "🧪 Testing build locally..."
if [ -d "build" ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🔐 Please make sure you're logged into Vercel..."
echo "Run 'vercel login' if you haven't already"
read -p "Press Enter to continue with deployment..."

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployment completed!"
echo ""
echo "📋 Next steps:"
echo "1. Note the deployment URL provided by Vercel"
echo "2. Update your backend CORS_ALLOWED_ORIGINS to include this URL"
echo "3. Set environment variables in Vercel dashboard if not already done"
echo ""
echo "🌐 Don't forget to update these environment variables in Vercel:"
echo "   - VITE_API_BASE_URL=https://your-backend-url.railway.app/api"
echo "   - VITE_RECAPTCHA_SITE_KEY=6LdDvmwrAAAAABu_dKFxpuZ4UVZl4osF5Er1-F95" 