# Development Utilities

This folder contains useful development and administrative utilities for the Healthcare Management Platform.

## 🔧 **Administrative Tools**

### `create_super_admin.py`
- **Purpose**: Creates super admin accounts for testing and development
- **Usage**: `python utilities/create_super_admin.py`
- **When to use**: Setting up new development environments, creating admin accounts

### `check_auth.py`
- **Purpose**: Quickly check authentication status of current user
- **Usage**: `python utilities/check_auth.py`
- **When to use**: Debugging authentication issues, verifying login status

## 🌐 **Browser Console Scripts**

### `login_script.js`
- **Purpose**: Quick login script for browser console
- **Usage**: Copy and paste into browser console at `http://localhost:5173`
- **When to use**: Fast development login without manual form filling

### `quick_admin_access.js`
- **Purpose**: Direct admin dashboard access via browser console
- **Usage**: Copy and paste into browser console
- **When to use**: Quick access to admin features during development

## 🧹 **Maintenance Tools**

### `cleanup_tool.py`
- **Purpose**: Project cleanup and maintenance operations
- **Usage**: `python utilities/cleanup_tool.py`
- **When to use**: Cleaning up temporary files, organizing project structure

### `cleanup_config.py`
- **Purpose**: Configuration for cleanup operations
- **Usage**: Imported by cleanup_tool.py
- **When to use**: Customizing cleanup behavior

## ⚠️ **Important Notes**

- **Development Only**: These tools are for development use only
- **Not Production**: Do not use these utilities in production environments
- **Security**: Some scripts may bypass normal security measures for development convenience
- **Dependencies**: Ensure the backend server is running for tools that make API calls

## 🚀 **Quick Start Guide**

1. **Create Admin Account**: `python utilities/create_super_admin.py`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Start Backend**: `cd backend && python manage.py runserver`
4. **Quick Login**: Open browser console and run `login_script.js`

---

*These utilities help streamline development workflows and administrative tasks.*
