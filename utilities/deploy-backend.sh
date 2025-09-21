#!/bin/bash

# Backend Deployment Script for Railway
# Run this script from the project root directory

echo "🚀 Starting Backend Deployment to Railway..."

# Check if we're in the right directory
if [ ! -f "railway.json" ]; then
    echo "❌ Error: railway.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found. Please run this script from the project root."
    exit 1
fi

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📥 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Please make sure you're logged into Railway..."
echo "Run 'railway login' if you haven't already"
read -p "Press Enter to continue with deployment..."

echo "🔧 Checking backend dependencies..."
if [ -f "backend/requirements.txt" ]; then
    echo "✅ requirements.txt found"
else
    echo "❌ requirements.txt not found in backend directory"
    exit 1
fi

echo "🐳 Verifying Docker configuration..."
if [ -f "Dockerfile.railway" ]; then
    echo "✅ Dockerfile.railway found"
else
    echo "❌ Dockerfile.railway not found"
    exit 1
fi

echo "🚀 Deploying to Railway..."
railway up

echo "✅ Backend deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Railway Dashboard to monitor the deployment"
echo "2. Add PostgreSQL database if not already added"
echo "3. Configure the following environment variables:"
echo ""
echo "🔑 Required Environment Variables:"
echo "   - JWT_SECRET_KEY=your_super_strong_jwt_secret_key"
echo "   - DEBUG=False"
echo "   - ALLOWED_HOSTS=.railway.app,.up.railway.app"
echo "   - CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app"
echo "   - OPENAI_API_KEY=your_openai_api_key"
echo "   - RAZORPAY_KEY_ID=your_razorpay_key_id"
echo "   - RAZORPAY_KEY_SECRET=your_razorpay_key_secret"
echo "   - AWS_ACCESS_KEY_ID=your_aws_access_key"
echo "   - AWS_SECRET_ACCESS_KEY=your_aws_secret_key"
echo "   - AWS_REGION=ap-south-1"
echo "   - S3_BUCKET_NAME=healthcare-general-purpose"
echo ""
echo "📊 Monitor deployment at: https://railway.app/dashboard"
echo "🔗 Your backend will be available at: https://your-project-name.up.railway.app" 