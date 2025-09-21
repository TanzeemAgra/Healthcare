# Healthcare Management Platform - Deployment Guide

## 🏗️ **Project Structure**

```
d:/alfiya/
├── backend/                 # Django Backend (Railway)
│   ├── manage.py
│   ├── requirements.txt     # Production dependencies
│   ├── railway.json         # Railway configuration
│   ├── railway.toml         # Railway build settings
│   └── backend/
│       ├── settings.py      # Django settings (Railway PostgreSQL)
│       ├── health_views.py  # Health check endpoints
│       └── urls.py          # URL routing
├── frontend/                # React Frontend (Vercel)
│   ├── package.json
│   ├── vite.config.js       # Production build config
│   ├── vercel.json          # Vercel deployment config
│   └── .env.production.template
├── test-documents/          # All test files moved here
├── utilities/               # Documentation and migration tools
└── docs/                    # Project documentation
```

## 🚀 **Deployment Instructions**

### **Backend - Railway Deployment**

1. **Prerequisites**:
   - Railway account
   - GitHub repository connected to Railway
   - PostgreSQL database service on Railway

2. **Environment Variables** (Set in Railway dashboard):
   ```bash
   DATABASE_URL=postgresql://postgres:TCxaXngnBHmwihKBGYAlYxCPFeIqbGOi@tramway.proxy.rlwy.net:17931/railway
   SECRET_KEY=your-production-secret-key
   DEBUG=False
   ALLOWED_HOSTS=*.railway.app,yourdomain.com
   
   # AWS Services
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_STORAGE_BUCKET_NAME=healthcare-general-purpose
   AWS_S3_REGION_NAME=ap-south-1
   
   # Email Configuration
   EMAIL_HOST_USER=your_email@domain.com
   EMAIL_HOST_PASSWORD=your_app_password
   
   # OpenAI API
   OPENAI_API_KEY=your_openai_key
   
   # Payment Gateways
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

3. **Deployment Commands**:
   ```bash
   # Railway will automatically run:
   # python manage.py collectstatic --noinput
   # python manage.py migrate --noinput  
   # gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT
   ```

4. **Health Check**: `https://your-app.railway.app/health/`

### **Frontend - Vercel Deployment**

1. **Prerequisites**:
   - Vercel account
   - GitHub repository connected to Vercel

2. **Environment Variables** (Set in Vercel dashboard):
   ```bash
   VITE_API_BASE_URL=https://your-backend.railway.app
   VITE_APP_NAME=Healthcare Management Platform
   VITE_ENVIRONMENT=production
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_key
   VITE_FRONTEND_DOMAIN=your-app.vercel.app
   ```

3. **Build Configuration**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Custom Domains**: Configure in Vercel dashboard

## 🔧 **Development Setup**

### **Backend (Local)**:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 8000
```

### **Frontend (Local)**:
```bash
cd frontend
npm install
npm run dev
```

## 🧪 **Testing & Verification**

### **Backend Health Checks**:
- Health: `/health/` - Database connectivity
- Readiness: `/ready/` - Migration status
- Root: `/` - Basic status

### **Frontend API Integration**:
- All API calls use `VITE_API_BASE_URL`
- Automatic fallback to localhost:8000 in development
- Production URLs configured via environment variables

### **Database Verification**:
- Railway PostgreSQL: 48 tables migrated
- Connection string: `postgresql://postgres:***@tramway.proxy.rlwy.net:17931/railway`
- Health check validates connectivity

## 📁 **File Organization**

### **Cleaned Up & Moved**:
- ✅ Test files → `test-documents/`
- ✅ Documentation → `utilities/`
- ✅ Migration tools → `utilities/`
- ✅ Docker files → Removed (not needed)
- ✅ Temporary files → Cleaned up

### **Production Ready**:
- ✅ Railway configuration optimized
- ✅ Vercel configuration updated
- ✅ Health check endpoints added
- ✅ Environment variables soft-coded
- ✅ Production dependencies specified

## 🔐 **Security Configuration**

- CORS settings for production domains
- HTTPS enforcement in production
- Security headers in Vercel config
- Database connection encryption
- JWT token authentication
- Environment-based configuration

## 📊 **Monitoring & Logging**

- Railway: Built-in logging and metrics
- Vercel: Analytics and performance monitoring
- Health check endpoints for uptime monitoring
- Error tracking via Django logging

---

**Status**: ✅ Ready for Production Deployment
**Architecture**: Frontend (Vercel) ↔ Backend (Railway) ↔ PostgreSQL (Railway)