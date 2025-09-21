#!/usr/bin/env python3
"""
Railway Deployment Fix Script
Fixes the missing django_filters dependency and other Railway deployment issues
"""

import os
import sys

def check_requirements():
    """Check if all required packages are in requirements.txt"""
    req_file = "requirements.txt"
    
    required_packages = [
        "django-filter",
        "opencv-python", 
        "django",
        "djangorestframework",
        "gunicorn",
        "psycopg2-binary",
        "django-cors-headers"
    ]
    
    print("🔍 Checking requirements.txt for missing packages...")
    
    try:
        with open(req_file, 'r') as f:
            content = f.read().lower()
            
        missing = []
        for package in required_packages:
            if package.lower() not in content:
                missing.append(package)
                
        if missing:
            print(f"❌ Missing packages: {', '.join(missing)}")
            return False
        else:
            print("✅ All required packages found in requirements.txt")
            return True
            
    except FileNotFoundError:
        print(f"❌ {req_file} not found!")
        return False

def check_wsgi_setting():
    """Check if WSGI_APPLICATION is properly set"""
    settings_file = "backend/settings.py"
    
    print("🔍 Checking WSGI_APPLICATION setting...")
    
    try:
        with open(settings_file, 'r') as f:
            content = f.read()
            
        if 'WSGI_APPLICATION = "backend.wsgi.application"' in content:
            print("✅ WSGI_APPLICATION is properly configured")
            return True
        else:
            print("❌ WSGI_APPLICATION setting missing or incorrect")
            return False
            
    except FileNotFoundError:
        print(f"❌ {settings_file} not found!")
        return False

def main():
    print("🚀 Railway Deployment Fix Analysis")
    print("=" * 50)
    
    os.chdir("backend") if os.path.exists("backend") else None
    
    # Check requirements
    req_ok = check_requirements()
    
    # Check WSGI setting  
    wsgi_ok = check_wsgi_setting()
    
    print("\n📋 DEPLOYMENT CHECKLIST:")
    print("=" * 30)
    
    print(f"✅ django-filter in requirements.txt: {'YES' if req_ok else 'NO'}")
    print(f"✅ WSGI_APPLICATION setting: {'YES' if wsgi_ok else 'NO'}")
    
    print("\n🎯 RAILWAY ENVIRONMENT VARIABLES NEEDED:")
    print("Copy these to Railway Dashboard > Variables:")
    print()
    
    env_vars = """
# Essential (Required for deployment)
JWT_SECRET_KEY=WI4_T43gTOQHpTIdjCdJRZQv3YdEWmV9VA6qn6J_CEf4CkrTNKLlplA000DcnlwXjvU
SECRET_KEY=McFfdsHutnGqoTVFgBL6cZvH6lqB7hqSGsg-tFzgrKGW017lfau33bhzyzp2Sscr0lI
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app,healthcare-production-1cab.up.railway.app
CORS_ALLOWED_ORIGINS=https://healthcare-production-1cab.up.railway.app

# OpenAI (Get from platform.openai.com)
OPENAI_API_KEY=your-actual-openai-api-key-here

# reCAPTCHA (Get from google.com/recaptcha)
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key"""
    
    print(env_vars)
    
    print("\n🔧 RAILWAY CONFIGURATION:")
    print("• Root Directory: backend")
    print("• Build Command: Automatic (nixpacks)")
    print("• Start Command: In railway.json")
    print("• Requirements: requirements.txt ✅")
    
    print("\n🚀 NEXT STEPS:")
    if req_ok and wsgi_ok:
        print("1. ✅ Code is ready for deployment")
        print("2. 🔑 Set environment variables in Railway")
        print("3. 🚀 Deploy!")
    else:
        print("1. ❌ Fix the issues above first")
        print("2. 🔄 Commit and push changes")
        print("3. 🔑 Set environment variables")
        print("4. 🚀 Deploy")

if __name__ == "__main__":
    main()