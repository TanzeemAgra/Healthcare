#!/usr/bin/env python3
"""
🧹 Healthcare Product File Cleanup Configuration
==============================================

SOFT CODING: Configuration-based approach for identifying and managing
unwanted development files in the healthcare product.

This configuration defines what types of files can be safely removed
without affecting the core functionality of the application.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Tuple

# SOFT CODING: File cleanup policies configuration
CLEANUP_POLICIES = {
    "test_files": {
        "enabled": True,
        "description": "Test files created during development",
        "patterns": [
            r"test_.*\.py$",          # test_user_creation.py, test_dashboard.py
            r".*_test\.py$",          # simple_server_test.py, s3_permission_test.py
            r"test-.*\.html$",        # test-plans.html, test-login.html
            r".*test.*\.html$",       # auth_test.html, super_admin_test.html
            r"test-.*\.mjs$",         # test-auth-flow.mjs
        ],
        "exclude_patterns": [
            r".*/tests\.py$",         # Keep Django test files
            r".*/test_.*models.*\.py$", # Keep model tests
        ]
    },
    
    "debug_files": {
        "enabled": True,
        "description": "Debug files used for troubleshooting",
        "patterns": [
            r"debug-.*\.js$",         # debug-permissions.js
            r".*debug.*\.py$",        # deploy_debug.py, debug_views.py
            r".*Debug.*\.jsx$",       # AdminDashboardDebug.jsx
        ],
        "exclude_patterns": []
    },
    
    "backup_files": {
        "enabled": True,
        "description": "Backup files and temporary copies",
        "patterns": [
            r".*-backup\.jsx$",       # hospital-dashboard-one-backup.jsx
            r".*\.backup$",
            r".*\.bak$",
            r".*_backup\..*$",
        ],
        "exclude_patterns": []
    },
    
    "temporary_files": {
        "enabled": True,
        "description": "Temporary files and demos",
        "patterns": [
            r".*_temp\.py$",          # urls_temp.py
            r".*demo\.py$",           # s3_demo.py
            r".*\.tmp$",
            r"temp_.*",
        ],
        "exclude_patterns": [
            r".*/template\.html$",    # Keep email templates
            r".*/templates/.*",       # Keep Django templates
        ]
    },
    
    "empty_files": {
        "enabled": True,
        "description": "Empty files with no content",
        "patterns": [
            r".*",                    # Match all files, then check if empty
        ],
        "check_empty": True,
        "exclude_patterns": [
            r"__init__\.py$",         # Keep Python package files
            r"\.gitkeep$",           # Keep git placeholder files
        ]
    }
}

# SOFT CODING: Directories to scan configuration
SCAN_DIRECTORIES = {
    "root": {
        "path": ".",
        "recursive": False,
        "description": "Root directory files"
    },
    "backend": {
        "path": "./backend",
        "recursive": True,
        "description": "Backend Django application"
    },
    "frontend": {
        "path": "./frontend",
        "recursive": True,
        "description": "Frontend React application"
    }
}

# SOFT CODING: Safety configuration
SAFETY_CONFIG = {
    "dry_run": False,             # Set to False to actually delete files
    "require_confirmation": False, # Ask before each deletion
    "backup_before_delete": False, # Create backup before deletion
    "log_deletions": True,        # Log all deletions
}

def is_file_excluded(file_path: str, exclude_patterns: List[str]) -> bool:
    """Check if file should be excluded from deletion"""
    for pattern in exclude_patterns:
        if re.search(pattern, file_path, re.IGNORECASE):
            return True
    return False

def is_file_empty(file_path: str) -> bool:
    """Check if file is empty or contains only whitespace"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read().strip()
            return len(content) == 0
    except:
        return False

def find_unwanted_files() -> Dict[str, List[Tuple[str, str]]]:
    """
    Find unwanted files based on the cleanup policies
    Returns: Dict with policy names as keys and list of (file_path, reason) tuples
    """
    unwanted_files = {}
    
    for policy_name, policy in CLEANUP_POLICIES.items():
        if not policy.get("enabled", False):
            continue
            
        unwanted_files[policy_name] = []
        
        for dir_name, dir_config in SCAN_DIRECTORIES.items():
            base_path = Path(dir_config["path"])
            
            if not base_path.exists():
                continue
                
            try:
                # Get all files in directory, avoiding problematic paths
                if dir_config["recursive"]:
                    # Use os.walk for better control over recursion
                    for root, dirs, files in os.walk(base_path):
                        # Skip node_modules and other problematic directories
                        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', '.venv']]
                        
                        for file in files:
                            file_path = Path(root) / file
                            file_str = str(file_path)
                            
                            # Check if file matches any pattern
                            matches_pattern = False
                            for pattern in policy["patterns"]:
                                if re.search(pattern, file_str, re.IGNORECASE):
                                    matches_pattern = True
                                    break
                            
                            if not matches_pattern:
                                continue
                            
                            # Check if file is excluded
                            if is_file_excluded(file_str, policy.get("exclude_patterns", [])):
                                continue
                            
                            # Special check for empty files
                            if policy.get("check_empty", False):
                                if not is_file_empty(file_str):
                                    continue
                            
                            reason = f"{policy['description']} - Pattern matched"
                            if policy.get("check_empty", False):
                                reason += " (empty file)"
                                
                            unwanted_files[policy_name].append((file_str, reason))
                else:
                    # Non-recursive scan
                    for file_path in base_path.iterdir():
                        if not file_path.is_file():
                            continue
                            
                        file_str = str(file_path)
                        
                        # Check if file matches any pattern
                        matches_pattern = False
                        for pattern in policy["patterns"]:
                            if re.search(pattern, file_str, re.IGNORECASE):
                                matches_pattern = True
                                break
                        
                        if not matches_pattern:
                            continue
                        
                        # Check if file is excluded
                        if is_file_excluded(file_str, policy.get("exclude_patterns", [])):
                            continue
                        
                        # Special check for empty files
                        if policy.get("check_empty", False):
                            if not is_file_empty(file_str):
                                continue
                        
                        reason = f"{policy['description']} - Pattern matched"
                        if policy.get("check_empty", False):
                            reason += " (empty file)"
                            
                        unwanted_files[policy_name].append((file_str, reason))
                        
            except (OSError, PermissionError) as e:
                print(f"Warning: Skipping directory {base_path} due to error: {e}")
                continue
    
    return unwanted_files

def generate_cleanup_report() -> str:
    """Generate a detailed cleanup report"""
    unwanted_files = find_unwanted_files()
    
    report = """
🧹 HEALTHCARE PRODUCT FILE CLEANUP REPORT
==========================================

This report identifies unwanted files that can be safely removed
without affecting the core functionality of the healthcare application.

"""
    
    total_files = 0
    for policy_name, files in unwanted_files.items():
        if not files:
            continue
            
        total_files += len(files)
        policy = CLEANUP_POLICIES[policy_name]
        
        report += f"""
📂 {policy_name.upper().replace('_', ' ')}
   Description: {policy['description']}
   Files found: {len(files)}

"""
        
        for file_path, reason in files:
            size = "Unknown"
            try:
                size = f"{os.path.getsize(file_path)} bytes"
            except:
                pass
            report += f"   ❌ {file_path} ({size})\n      Reason: {reason}\n\n"
    
    if total_files == 0:
        report += "✅ No unwanted files found! Your workspace is clean.\n"
    else:
        report += f"""
📊 SUMMARY
==========
Total unwanted files: {total_files}
Safety mode: {'ON' if SAFETY_CONFIG['dry_run'] else 'OFF'}
Confirmation required: {'YES' if SAFETY_CONFIG['require_confirmation'] else 'NO'}

💡 NEXT STEPS:
- Review the files listed above
- Update SAFETY_CONFIG['dry_run'] to False to enable actual deletion
- Run the cleanup function to remove unwanted files
"""
    
    return report

if __name__ == "__main__":
    print(generate_cleanup_report())
