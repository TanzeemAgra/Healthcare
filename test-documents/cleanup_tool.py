#!/usr/bin/env python3
"""
🧹 Healthcare Product File Cleanup Tool
=====================================

SOFT CODING: Configuration-driven file cleanup based on cleanup_config.py

This tool safely removes unwanted development files while preserving
essential functionality of the healthcare application.
"""

import os
import shutil
from datetime import datetime
from pathlib import Path
from cleanup_config import (
    find_unwanted_files, 
    SAFETY_CONFIG, 
    CLEANUP_POLICIES,
    generate_cleanup_report
)

def log_action(message: str, log_file: str = "cleanup.log"):
    """Log cleanup actions with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}\n"
    
    with open(log_file, "a", encoding="utf-8") as f:
        f.write(log_entry)
    
    print(log_entry.strip())

def confirm_deletion(file_path: str) -> bool:
    """Ask user for confirmation before deletion"""
    if not SAFETY_CONFIG.get("require_confirmation", True):
        return True
    
    response = input(f"Delete '{file_path}'? (y/N): ").lower().strip()
    return response in ['y', 'yes']

def backup_file(file_path: str) -> str:
    """Create backup of file before deletion"""
    backup_dir = Path("./cleanup_backups")
    backup_dir.mkdir(exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    file_name = Path(file_path).name
    backup_path = backup_dir / f"{timestamp}_{file_name}"
    
    try:
        shutil.copy2(file_path, backup_path)
        return str(backup_path)
    except Exception as e:
        log_action(f"ERROR: Failed to backup {file_path}: {e}")
        return ""

def delete_file(file_path: str, reason: str) -> bool:
    """Safely delete a file with logging and optional backup"""
    try:
        # Create backup if configured
        if SAFETY_CONFIG.get("backup_before_delete", False):
            backup_path = backup_file(file_path)
            if backup_path:
                log_action(f"BACKUP: Created backup at {backup_path}")
        
        # Check if dry run mode
        if SAFETY_CONFIG.get("dry_run", True):
            log_action(f"DRY RUN: Would delete {file_path} - {reason}")
            return True
        
        # Ask for confirmation if required
        if not confirm_deletion(file_path):
            log_action(f"SKIPPED: User declined to delete {file_path}")
            return False
        
        # Actually delete the file
        os.remove(file_path)
        log_action(f"DELETED: {file_path} - {reason}")
        return True
        
    except Exception as e:
        log_action(f"ERROR: Failed to delete {file_path}: {e}")
        return False

def execute_cleanup():
    """Execute the file cleanup based on configuration"""
    print("🧹 Starting Healthcare Product File Cleanup...")
    print("=" * 50)
    
    # Initialize log
    if SAFETY_CONFIG.get("log_deletions", True):
        log_action("Starting file cleanup process")
    
    # Find unwanted files
    unwanted_files = find_unwanted_files()
    
    total_files = sum(len(files) for files in unwanted_files.values())
    
    if total_files == 0:
        print("✅ No unwanted files found! Your workspace is clean.")
        return
    
    print(f"Found {total_files} unwanted files across {len(unwanted_files)} categories")
    
    if SAFETY_CONFIG.get("dry_run", True):
        print("🔒 DRY RUN MODE: Files will not actually be deleted")
    
    print()
    
    # Process each category
    deleted_count = 0
    skipped_count = 0
    
    for policy_name, files in unwanted_files.items():
        if not files:
            continue
        
        policy = CLEANUP_POLICIES[policy_name]
        print(f"📂 Processing {policy_name.replace('_', ' ').title()}")
        print(f"   Description: {policy['description']}")
        print(f"   Files to process: {len(files)}")
        print()
        
        for file_path, reason in files:
            if delete_file(file_path, reason):
                deleted_count += 1
            else:
                skipped_count += 1
    
    # Summary
    print("\n" + "=" * 50)
    print("🎯 CLEANUP SUMMARY")
    print("=" * 50)
    
    if SAFETY_CONFIG.get("dry_run", True):
        print(f"📋 Files identified for deletion: {deleted_count}")
        print(f"⏭️  Files skipped: {skipped_count}")
        print("\n💡 To actually delete files:")
        print("   1. Review the list above carefully")
        print("   2. Edit cleanup_config.py and set SAFETY_CONFIG['dry_run'] = False")
        print("   3. Run this script again")
    else:
        print(f"✅ Files successfully deleted: {deleted_count}")
        print(f"⏭️  Files skipped: {skipped_count}")
        
        if SAFETY_CONFIG.get("backup_before_delete", False):
            print("📦 Backups created in ./cleanup_backups/")
    
    if SAFETY_CONFIG.get("log_deletions", True):
        print("📝 Detailed log saved to cleanup.log")
        log_action("File cleanup process completed")

def show_preview():
    """Show preview of what would be cleaned up"""
    print(generate_cleanup_report())

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--preview":
        show_preview()
    else:
        execute_cleanup()
