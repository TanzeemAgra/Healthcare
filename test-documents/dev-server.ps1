# Mastermind Development Server Manager
# This script manages both frontend and backend servers with proper terminal management

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "status", "help")]
    [string]$Action = "help"
)

function Show-Help {
    Write-Host "=== Mastermind Development Server Manager ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\dev-server.ps1 [action]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Green
    Write-Host "  start    - Start both frontend and backend servers"
    Write-Host "  stop     - Stop all running servers"
    Write-Host "  restart  - Restart both servers"
    Write-Host "  status   - Check server status"
    Write-Host "  help     - Show this help message"
    Write-Host ""
    Write-Host "Server URLs:" -ForegroundColor Blue
    Write-Host "  Frontend: http://localhost:5173"
    Write-Host "  Backend:  http://localhost:8000"
}

function Start-Servers {
    Write-Host "Starting Mastermind Development Servers..." -ForegroundColor Green
    
    # Start Backend Server
    Write-Host "Starting Django Backend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; python backend/manage.py runserver" -WindowStyle Normal
    
    # Wait a moment for backend to start
    Start-Sleep -Seconds 3
    
    # Start Frontend Server
    Write-Host "Starting React Frontend Server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot/frontend'; npm run dev" -WindowStyle Normal
    
    Write-Host ""
    Write-Host "✅ Both servers are starting up!" -ForegroundColor Green
    Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "🔧 Backend:  http://localhost:8000" -ForegroundColor Cyan
}

function Stop-Servers {
    Write-Host "Stopping all development servers..." -ForegroundColor Red
    
    # Kill Django processes
    Get-Process | Where-Object {$_.ProcessName -eq "python" -and $_.CommandLine -like "*manage.py*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Kill Node processes (frontend)
    Get-Process | Where-Object {$_.ProcessName -eq "node" -and $_.CommandLine -like "*vite*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Write-Host "✅ All servers stopped!" -ForegroundColor Green
}

function Get-ServerStatus {
    Write-Host "Checking server status..." -ForegroundColor Yellow
    
    # Check Django backend
    try {
        $backendResponse = Invoke-WebRequest -Uri "http://localhost:8000" -TimeoutSec 3 -ErrorAction Stop
        Write-Host "✅ Backend (Django): Running on http://localhost:8000" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Backend (Django): Not running" -ForegroundColor Red
    }
    
    # Check React frontend
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3 -ErrorAction Stop
        Write-Host "✅ Frontend (React): Running on http://localhost:5173" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Frontend (React): Not running" -ForegroundColor Red
    }
}

function Restart-Servers {
    Write-Host "Restarting development servers..." -ForegroundColor Yellow
    Stop-Servers
    Start-Sleep -Seconds 2
    Start-Servers
}

# Main script logic
switch ($Action) {
    "start" { Start-Servers }
    "stop" { Stop-Servers }
    "restart" { Restart-Servers }
    "status" { Get-ServerStatus }
    "help" { Show-Help }
    default { Show-Help }
}
