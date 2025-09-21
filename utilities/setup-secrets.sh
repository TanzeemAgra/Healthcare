#!/bin/bash

# GitHub Secrets Setup Script for Healthcare Solution CI/CD
# This script helps you set up GitHub repository secrets for automated deployments

echo "🔐 GitHub Secrets Setup for Healthcare Solution"
echo "=============================================="
echo ""

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "📥 Install it from: https://cli.github.com/"
    echo "Then run: gh auth login"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "🔑 Run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated."
echo ""

# Get repository information
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "📁 Repository: $REPO"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_description=$2
    local secret_value
    
    echo "🔑 Setting up: $secret_name"
    echo "📝 Description: $secret_description"
    read -sp "Enter value: " secret_value
    echo ""
    
    if [ -n "$secret_value" ]; then
        gh secret set "$secret_name" --body "$secret_value"
        echo "✅ $secret_name set successfully"
    else
        echo "⚠️  Skipped $secret_name (empty value)"
    fi
    echo ""
}

echo "🚀 Setting up Frontend (Vercel) Secrets"
echo "======================================="

set_secret "VERCEL_TOKEN" "Vercel API token from https://vercel.com/account/tokens"
set_secret "VERCEL_ORG_ID" "Vercel Team/Organization ID from project settings"
set_secret "VERCEL_PROJECT_ID" "Vercel Project ID from project settings"
set_secret "VITE_API_URL" "Backend API URL (e.g., https://your-app.railway.app/api)"
set_secret "VITE_RECAPTCHA_SITE_KEY" "Google reCAPTCHA site key"
set_secret "VITE_PUBLIC_URL" "Frontend URL (e.g., https://your-app.vercel.app)"
set_secret "VITE_RAZORPAY_KEY_ID" "Razorpay key ID for payments"

echo "🗄️  Setting up Backend (Railway) Secrets"
echo "========================================"

set_secret "RAILWAY_TOKEN" "Railway API token from https://railway.app/account"
set_secret "RAILWAY_SERVICE_ID" "Railway service ID from project settings"
set_secret "DJANGO_SECRET_KEY" "Django secret key (generate with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')"
set_secret "DATABASE_URL" "Database connection string (PostgreSQL recommended)"
set_secret "BACKEND_URL" "Backend URL (e.g., https://your-app.railway.app)"

echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "✅ All secrets have been configured for your repository."
echo "🚀 You can now push changes to trigger automated deployments."
echo ""
echo "📚 Next steps:"
echo "1. Commit your GitHub Actions workflows:"
echo "   git add .github/workflows/"
echo "   git commit -m 'Add CI/CD workflows'"
echo "   git push"
echo ""
echo "2. Test deployments by making changes to frontend/ or backend/ directories"
echo ""
echo "📖 For detailed instructions, see: DEPLOYMENT-SETUP.md"
echo ""
echo "🔗 View your secrets at: https://github.com/$REPO/settings/secrets/actions"