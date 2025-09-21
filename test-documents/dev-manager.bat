@echo off
title Mastermind Development Server Manager

:menu
cls
echo ===============================================
echo    Mastermind Development Server Manager
echo ===============================================
echo.
echo 1. Start Both Servers
echo 2. Start Backend Only (Django)
echo 3. Start Frontend Only (React)
echo 4. Stop All Servers
echo 5. Check Server Status
echo 6. Exit
echo.
echo Current Server URLs:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8000
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto start_both
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto stop_servers
if "%choice%"=="5" goto check_status
if "%choice%"=="6" goto exit
goto menu

:start_both
echo Starting both servers...
start "Django Backend" cmd /k "cd /d %~dp0 && python backend/manage.py runserver"
timeout /t 3 /nobreak > nul
start "React Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"
echo Both servers are starting!
pause
goto menu

:start_backend
echo Starting Django backend server...
start "Django Backend" cmd /k "cd /d %~dp0 && python backend/manage.py runserver"
echo Backend server started!
pause
goto menu

:start_frontend
echo Starting React frontend server...
start "React Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"
echo Frontend server started!
pause
goto menu

:stop_servers
echo Stopping all servers...
taskkill /f /im python.exe /fi "WINDOWTITLE eq Django*" 2>nul
taskkill /f /im node.exe /fi "WINDOWTITLE eq React*" 2>nul
echo All servers stopped!
pause
goto menu

:check_status
echo Checking server status...
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Backend (Django): Running on http://localhost:8000
) else (
    echo ✗ Backend (Django): Not running
)

curl -s http://localhost:5173 >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Frontend (React): Running on http://localhost:5173
) else (
    echo ✗ Frontend (React): Not running
)
pause
goto menu

:exit
echo Goodbye!
exit /b 0
