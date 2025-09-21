# 🎯 Project Structure Automation Commands

## Quick Organization Commands (PowerShell)

```powershell
# Run the automated structure maintenance tool
python maintain_structure.py

# Verify project structure compliance
python -c "from maintain_structure import ProjectOrganizer; ProjectOrganizer().verify_structure()"

# Quick file organization check
Get-ChildItem -Path "." -Name "test_*.py", "debug_*.py", "Dockerfile*" | ForEach-Object { Write-Host "❌ Misplaced file: $_" }

# Environment verification for deployment
if ($env:DATABASE_URL) { Write-Host "✅ DATABASE_URL configured" } else { Write-Host "❌ DATABASE_URL missing" }
if ($env:VITE_API_BASE_URL) { Write-Host "✅ VITE_API_BASE_URL configured" } else { Write-Host "❌ VITE_API_BASE_URL missing" }

# Backend deployment readiness check
cd backend
python manage.py check --deploy
cd ..

# Frontend build verification
cd frontend
npm run build
cd ..
```

## Pre-Commit Structure Check

Create this as a Git pre-commit hook to automatically maintain structure:

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "🔍 Checking project structure..."
python maintain_structure.py

if [ $? -ne 0 ]; then
    echo "❌ Project structure issues found. Please fix before committing."
    exit 1
fi

echo "✅ Project structure is compliant"
```

## Automated Maintenance Schedule

Run these commands periodically to maintain project health:

```powershell
# Daily structure maintenance
python maintain_structure.py

# Weekly deployment verification
cd backend; python manage.py check --deploy; cd ..
cd frontend; npm run build > nul 2>&1; if ($?) { Write-Host "✅ Frontend build OK" } else { Write-Host "❌ Frontend build failed" }; cd ..

# Monthly dependency updates
cd backend; pip list --outdated; cd ..
cd frontend; npm outdated; cd ..
```

## Emergency Recovery Commands

If project structure gets messy, use these recovery commands:

```powershell
# Force organize all files
python -c "from maintain_structure import ProjectOrganizer; org = ProjectOrganizer(); org.organize_files(); org.verify_structure()"

# Reset to clean structure
New-Item -ItemType Directory -Force -Path "test-documents"
New-Item -ItemType Directory -Force -Path "utilities"
Move-Item -Path "test_*.py" -Destination "test-documents/" -Force
Move-Item -Path "debug_*.py" -Destination "test-documents/" -Force
Move-Item -Path "*.md" -Destination "utilities/" -Force -Exclude "README.md"
Remove-Item -Path "Dockerfile*" -Force
Remove-Item -Path "docker-compose.*" -Force
```

## Development Workflow Integration

```powershell
# Before starting new feature development
python maintain_structure.py

# Before pushing to repository
python maintain_structure.py
git add .
git commit -m "Feature: [description] (structure verified)"

# Before deployment
python maintain_structure.py
cd backend; python manage.py check --deploy; cd ..
cd frontend; npm run build; cd ..
```

---

💡 **Pro Tip**: Add `python maintain_structure.py` to your IDE's build tasks for automatic structure maintenance.