# 🚀 Mastermind Development Server Management

This document explains how to manage your development servers efficiently without creating multiple terminals.

## 🎯 Problem Solved
- **No more terminal clutter**: Use dedicated terminals for frontend and backend
- **Easy server management**: Start/stop/restart with simple commands
- **Consistent development environment**: Reuse the same terminals every time

## 🛠️ Available Methods

### Method 1: VS Code Tasks (Recommended)
Use the Command Palette (`Ctrl+Shift+P`) and search for "Tasks: Run Task", then choose:

- **Start Backend Server** - Starts Django on http://localhost:8000
- **Start Frontend Server** - Starts React on http://localhost:5173  
- **Start Both Servers** - Starts both servers simultaneously
- **Django Migrate** - Runs database migrations
- **Django Make Migrations** - Creates new migrations

#### Benefits:
- ✅ Reuses existing terminals (`instanceLimit: 1`)
- ✅ Dedicated terminal panels for each server
- ✅ Integrated with VS Code
- ✅ Shows reuse messages to confirm terminal reuse

### Method 2: PowerShell Script
Run the PowerShell script from the project root:

```powershell
# Start both servers
.\dev-server.ps1 start

# Stop all servers
.\dev-server.ps1 stop

# Restart servers
.\dev-server.ps1 restart

# Check server status
.\dev-server.ps1 status

# Show help
.\dev-server.ps1 help
```

### Method 3: Batch File (Windows)
Double-click `dev-manager.bat` for an interactive menu:

```
1. Start Both Servers
2. Start Backend Only (Django)
3. Start Frontend Only (React)
4. Stop All Servers
5. Check Server Status
6. Exit
```

## 🔧 How Terminal Reuse Works

### VS Code Tasks Configuration
The `tasks.json` includes these key settings for terminal management:

```json
{
    "presentation": {
        "panel": "dedicated",        // Each task gets its own terminal
        "showReuseMessage": true     // Shows when terminal is reused
    },
    "runOptions": {
        "instanceLimit": 1           // Only one instance per task
    }
}
```

### Benefits:
- **Dedicated Terminals**: Each server type gets its own terminal
- **Instance Limiting**: Prevents multiple instances of the same server
- **Clear Identification**: Terminals are named (e.g., "Backend Server", "Frontend Server")
- **Reuse Messages**: VS Code shows when it reuses an existing terminal

## 🎯 Best Practices

### 1. Use VS Code Tasks for Development
- Open Command Palette (`Ctrl+Shift+P`)
- Type "Tasks: Run Task"
- Select your desired task
- The same terminal will be reused each time

### 2. Managing Running Servers
- **To stop**: Use `Ctrl+C` in the respective terminal
- **To restart**: Run the task again (will reuse the terminal)
- **Multiple terminals**: Each server type gets its dedicated terminal

### 3. Terminal Organization
- **Backend Terminal**: Shows Django logs and database queries
- **Frontend Terminal**: Shows Vite build output and hot reload messages
- **Separate panels**: Easy to monitor both servers simultaneously

## 🔍 Troubleshooting

### If you see multiple terminals:
1. **Close extra terminals manually** (click the trash icon)
2. **Use the tasks instead of manual commands**
3. **Check that `instanceLimit: 1` is set in tasks.json**

### If tasks don't work:
1. **Check VS Code Task Runner extension** is enabled
2. **Verify paths in tasks.json** match your project structure
3. **Use PowerShell script as backup**

### Server conflicts:
1. **Stop all servers**: Use `.\dev-server.ps1 stop` or the batch file
2. **Check ports**: Ensure 8000 (Django) and 5173 (Vite) are free
3. **Restart VS Code** if terminals seem stuck

## 📁 Files Created

- `.vscode/tasks.json` - VS Code task definitions
- `.vscode/launch.json` - Debug configuration
- `dev-server.ps1` - PowerShell management script
- `dev-manager.bat` - Windows batch file with menu
- `DEVELOPMENT.md` - This documentation

## 🚀 Quick Start

1. **Open VS Code in your project directory**
2. **Press `Ctrl+Shift+P`**
3. **Type "Tasks: Run Task"**
4. **Select "Start Both Servers"**
5. **Enjoy clean terminal management!**

Your servers will start in dedicated, reusable terminals! 🎉
