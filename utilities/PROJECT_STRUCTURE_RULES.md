# 🏗️ **PROJECT STRUCTURE MAINTENANCE GUIDE**

## 📋 **Mandatory File Organization Rules**

### **🚫 NEVER Place These Files in Root Directory:**
- `test_*.py` → Always move to `test-documents/`
- `debug_*.py` → Always move to `test-documents/`
- `*.md` files (except README.md) → Always move to `utilities/`
- Temporary scripts → Move to `test-documents/`
- Migration tools → Move to `utilities/`
- Docker files → Delete (we use Railway/Vercel)

### **✅ ALWAYS Maintain This Structure:**
```
d:/alfiya/
├── README.md                          # Main deployment guide
├── PROJECT_STRUCTURE_RULES.md         # This file (never move)
├── backend/                          # Django Backend
│   ├── requirements.txt              # Production dependencies only
│   ├── railway.json                  # Railway deployment config
│   ├── railway.toml                  # Railway build settings
│   ├── manage.py                     
│   ├── .env                         # Local development
│   ├── .env.production              # Production template
│   └── backend/
│       ├── settings.py              # Railway PostgreSQL connection
│       ├── health_views.py          # Health endpoints
│       └── urls.py                  # URL routing
├── frontend/                         # React Frontend
│   ├── package.json
│   ├── vite.config.js               # Environment-aware config
│   ├── vercel.json                  # Vercel deployment
│   ├── .env.production.template     # Environment variables
│   └── src/
│       └── config/                  # All configs use env vars
├── test-documents/                   # ALL test files here
│   ├── test_*.py                    # Backend tests
│   ├── debug_*.py                   # Debug scripts
│   ├── *.html                       # Test HTML files
│   └── migration_scripts/           # Migration tools
├── utilities/                        # Documentation & tools
│   ├── *.md                         # All documentation
│   ├── migration_logs/              # Migration history
│   └── backup_files/                # Backup information
└── docs/                            # Project documentation
```

## 🔧 **Configuration Standards**

### **Backend Requirements (requirements.txt)**
```python
# Production requirements for Railway deployment
Django>=5.0,<6.0
djangorestframework>=3.14.0
psycopg2-binary>=2.9.0
django-cors-headers>=4.0.0
dj-database-url>=2.0.0
python-dotenv>=1.0.0
gunicorn>=21.0.0
whitenoise>=6.0.0
# ... specific versions only
```

### **Frontend API Configuration**
```javascript
// ALWAYS use environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// NEVER hardcode URLs like:
// const API_BASE_URL = 'http://localhost:8000';  // ❌ WRONG
```

### **Railway Configuration (railway.json)**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "python manage.py collectstatic --noinput && python manage.py migrate --noinput && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT",
    "healthcheckPath": "/health/",
    "healthcheckTimeout": 300,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

## 🤖 **Automated Maintenance Commands**

### **File Organization Script (PowerShell)**
```powershell
# Run this after adding new files
Move-Item -Path "*.py" -Destination "test-documents\" -Include "test_*", "debug_*" -Force
Move-Item -Path "*.md" -Destination "utilities\" -Exclude "README.md" -Force
Remove-Item -Path "Dockerfile*", "docker-compose.yml" -Force -ErrorAction SilentlyContinue
```

### **Environment Variables Check**
```bash
# Backend check
cd backend
python -c "
import os
from django.conf import settings
print('✅ DATABASE_URL configured' if 'DATABASE_URL' in os.environ else '❌ Set DATABASE_URL')
print('✅ Railway PostgreSQL' if 'railway' in os.environ.get('DATABASE_URL', '') else '❌ Wrong database')
"

# Frontend check  
cd frontend
node -e "
const config = require('./vite.config.js');
console.log('✅ Environment variables configured' if config.toString().includes('import.meta.env') else '❌ Hardcoded URLs found');
"
```

## 📝 **Pre-Deployment Checklist**

### **Before Every Deployment:**

**Backend Verification:**
- [ ] `python manage.py check` passes
- [ ] `requirements.txt` has specific versions
- [ ] `railway.json` configured properly
- [ ] Health endpoints `/health/`, `/ready/` working
- [ ] No test files in root directory
- [ ] Database uses Railway PostgreSQL exclusively

**Frontend Verification:**  
- [ ] `npm run build` succeeds
- [ ] All API calls use `VITE_API_BASE_URL`
- [ ] `vercel.json` configured
- [ ] No hardcoded localhost URLs
- [ ] Environment variables template updated

**File Organization:**
- [ ] All `test_*.py` in `test-documents/`
- [ ] All `*.md` (except README.md) in `utilities/`
- [ ] No Docker files present
- [ ] Project structure matches template

## 🔄 **Update Workflow**

### **When Adding New Features:**

1. **Create files in correct locations:**
   ```
   Backend code → backend/
   Frontend code → frontend/src/
   Tests → test-documents/
   Documentation → utilities/
   ```

2. **Use environment variables:**
   ```javascript
   // Frontend
   const API_URL = import.meta.env.VITE_API_BASE_URL;
   
   // Backend  
   DATABASE_URL = os.getenv('DATABASE_URL')
   ```

3. **Update requirements with versions:**
   ```
   new-package>=1.0.0,<2.0.0  # ✅ Good
   new-package                 # ❌ Bad
   ```

4. **Run organization script:**
   ```bash
   # Move any misplaced files
   Move-Item test_* test-documents/
   Move-Item *.md utilities/ -Exclude README.md
   ```

## 🚨 **Common Mistakes to Avoid**

### **❌ DON'T DO THIS:**
- Placing test files in root directory
- Hardcoding API URLs
- Adding Docker files
- Using unversioned dependencies
- Skipping health check endpoints
- Mixing development and production configs

### **✅ ALWAYS DO THIS:**
- Organize files immediately after creation
- Use environment variables for all configs
- Maintain Railway/Vercel deployment files
- Version all dependencies specifically  
- Test health endpoints regularly
- Separate development and production environments

## 🛡️ **Structure Protection**

### **Git Hooks (Optional)**
```bash
#!/bin/bash
# pre-commit hook
if ls test_*.py >/dev/null 2>&1; then
    echo "❌ Error: test_*.py files found in root. Move to test-documents/"
    exit 1
fi

if ls debug_*.py >/dev/null 2>&1; then
    echo "❌ Error: debug_*.py files found in root. Move to test-documents/"  
    exit 1
fi
```

### **CI/CD Integration**
```yaml
# GitHub Actions check
- name: Verify Project Structure
  run: |
    if [ -f "test_*.py" ]; then echo "❌ Test files in wrong location" && exit 1; fi
    if [ -f "Dockerfile" ]; then echo "❌ Docker files not allowed" && exit 1; fi
    echo "✅ Project structure verified"
```

---

## 🎯 **Remember: Consistency is Key!**

**This structure ensures:**
- ✅ Professional organization
- ✅ Easy deployment to Railway/Vercel  
- ✅ Maintainable codebase
- ✅ Clear separation of concerns
- ✅ Environment-based configuration
- ✅ Scalable architecture

**Follow these rules for every update, and your project will remain production-ready and professionally structured!**