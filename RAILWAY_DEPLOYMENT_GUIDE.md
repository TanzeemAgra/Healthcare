# Railway Deployment Guide for Healthcare Application

## Problem 1 Solution: WSGI_APPLICATION Setting ✅

**Issue**: `Failed to find your WSGI_APPLICATION django setting`

**Fix Applied**: Added `WSGI_APPLICATION = "backend.wsgi.application"` to `backend/backend/settings.py`

## Problem 2 Solution: Backend URL Configuration ✅

**Current Backend URL**: `https://healthcare-production-1cab.up.railway.app`
**Port**: `8080` (automatically handled by Railway)

### Updated Files:

1. **Frontend Environment** (`frontend/.env`):
   ```env
   VITE_API_BASE_URL=https://healthcare-production-1cab.up.railway.app
   ```

2. **Railway Template** (`utilities/.env.railway`):
   ```env
   ALLOWED_HOSTS=.railway.app,.up.railway.app,healthcare-production-1cab.up.railway.app
   ```

## Railway Environment Variables Required

Set these in your Railway project dashboard:

### Essential Variables:
```bash
# Django Core
JWT_SECRET_KEY=your_very_strong_and_random_jwt_secret_key_here
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=.railway.app,.up.railway.app,healthcare-production-1cab.up.railway.app
CORS_ALLOWED_ORIGINS=https://healthcare-production-1cab.up.railway.app

# Database (Railway auto-provides DATABASE_URL)
# DATABASE_URL=postgresql://... (auto-generated)

# OpenAI API
OPENAI_API_KEY=your_actual_openai_api_key

# Google reCAPTCHA
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# AWS S3 (Optional - for file storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=healthcare-general-purpose

# Razorpay (Optional - for payments)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Deployment Steps

1. **Push Updated Code**:
   ```bash
   git add .
   git commit -m "Fix Railway deployment: Add WSGI_APPLICATION and update backend URLs"
   git push origin main
   ```

2. **Connect Railway to GitHub**:
   - Go to Railway dashboard
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

3. **Set Environment Variables**:
   - Copy variables from above into Railway environment settings
   - Replace placeholder values with your actual keys

4. **Deploy**:
   - Railway will automatically deploy when you push to main branch
   - Monitor deployment logs for any issues

## Railway Configuration Files

- `backend/railway.json` - Deployment configuration ✅
- `backend/requirements.txt` - Python dependencies with gunicorn ✅  
- `backend/backend/settings.py` - Django settings with WSGI_APPLICATION ✅

## Testing After Deployment

1. **Backend Health Check**:
   ```bash
   curl https://healthcare-production-1cab.up.railway.app/health/
   ```

2. **API Test**:
   ```bash
   curl https://healthcare-production-1cab.up.railway.app/api/hospital/
   ```

3. **Frontend Connection**: 
   - Update your frontend `.env` file with the Railway backend URL
   - Test frontend-backend connectivity

## Common Issues & Solutions

### Build Failures:
- Ensure `WSGI_APPLICATION` is set in settings.py ✅
- Check that all dependencies are in requirements.txt ✅
- Verify railway.json configuration ✅

### Runtime Errors:
- Set all required environment variables
- Check ALLOWED_HOSTS includes Railway domain ✅
- Monitor Railway logs for detailed error information

### Database Issues:
- Railway provides PostgreSQL automatically
- Ensure migrations run during deployment ✅
- Check DATABASE_URL environment variable

## Next Steps

1. Deploy to Railway with updated configuration
2. Test all API endpoints
3. Update frontend to use Railway backend URL
4. Configure custom domain if needed
5. Set up monitoring and logging

## Support

If deployment still fails, check:
- Railway deployment logs
- Django settings.py WSGI configuration
- Environment variables are properly set
- requirements.txt includes all dependencies