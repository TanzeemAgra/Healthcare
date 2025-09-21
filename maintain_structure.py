#!/usr/bin/env python3
"""
Project Structure Maintenance Tool
Automatically organizes files according to project standards
Run this script after adding new files to maintain professional structure
"""

import os
import shutil
import glob
from pathlib import Path

class ProjectOrganizer:
    def __init__(self, project_root="d:/alfiya"):
        self.project_root = Path(project_root)
        self.test_docs = self.project_root / "test-documents"
        self.utilities = self.project_root / "utilities"
        
        # Ensure directories exist
        self.test_docs.mkdir(exist_ok=True)
        self.utilities.mkdir(exist_ok=True)
        
    def organize_files(self):
        """Main organization function"""
        print("🔧 Starting Project Structure Maintenance...")
        
        moved_files = []
        deleted_files = []
        
        # Move test files
        moved_files.extend(self._move_test_files())
        
        # Move documentation files
        moved_files.extend(self._move_documentation())
        
        # Remove Docker files
        deleted_files.extend(self._remove_docker_files())
        
        # Move migration and backup files
        moved_files.extend(self._move_migration_files())
        
        # Clean up temporary files
        deleted_files.extend(self._clean_temp_files())
        
        self._print_summary(moved_files, deleted_files)
        
    def _move_test_files(self):
        """Move all test and debug files to test-documents/"""
        patterns = [
            "test_*.py", "debug_*.py", "*test*.html", 
            "check_*.py", "simple_*.py", "*_test.js"
        ]
        
        moved = []
        for pattern in patterns:
            for file_path in self.project_root.glob(pattern):
                if file_path.is_file():
                    dest = self.test_docs / file_path.name
                    shutil.move(str(file_path), str(dest))
                    moved.append(f"📁 {file_path.name} → test-documents/")
                    
            # Also check backend directory
            backend_dir = self.project_root / "backend"
            if backend_dir.exists():
                for file_path in backend_dir.glob(pattern):
                    if file_path.is_file():
                        dest = self.test_docs / file_path.name
                        shutil.move(str(file_path), str(dest))
                        moved.append(f"📁 backend/{file_path.name} → test-documents/")
        
        return moved
        
    def _move_documentation(self):
        """Move markdown files to utilities/ (except README.md)"""
        moved = []
        
        for md_file in self.project_root.glob("*.md"):
            if md_file.name != "README.md" and md_file.is_file():
                dest = self.utilities / md_file.name
                shutil.move(str(md_file), str(dest))
                moved.append(f"📄 {md_file.name} → utilities/")
                
        # Also check backend directory
        backend_dir = self.project_root / "backend"
        if backend_dir.exists():
            for md_file in backend_dir.glob("*.md"):
                if md_file.is_file():
                    dest = self.utilities / md_file.name
                    shutil.move(str(md_file), str(dest))
                    moved.append(f"📄 backend/{md_file.name} → utilities/")
                    
        return moved
        
    def _remove_docker_files(self):
        """Remove Docker-related files (not needed for Railway/Vercel)"""
        docker_patterns = [
            "Dockerfile*", "docker-compose.yml", "docker-compose.yaml",
            ".dockerignore", "entrypoint.sh"
        ]
        
        deleted = []
        for pattern in docker_patterns:
            for file_path in self.project_root.glob(pattern):
                if file_path.is_file():
                    file_path.unlink()
                    deleted.append(f"🗑️  {file_path.name} (Docker file)")
                    
            # Also check backend directory
            backend_dir = self.project_root / "backend"
            if backend_dir.exists():
                for file_path in backend_dir.glob(pattern):
                    if file_path.is_file():
                        file_path.unlink()
                        deleted.append(f"🗑️  backend/{file_path.name} (Docker file)")
                        
        return deleted
        
    def _move_migration_files(self):
        """Move migration and backup files to utilities/"""
        patterns = [
            "migrate_*.py", "migration_*.py", "backup_*.json",
            "migration_report_*.json", "*migration*.py",
            ".env.*", "deploy-*.sh", "setup-*.sh", "deploy*.sh"
        ]
        
        moved = []
        for pattern in patterns:
            # Check root directory
            for file_path in self.project_root.glob(pattern):
                if file_path.is_file():
                    dest = self.utilities / file_path.name
                    shutil.move(str(file_path), str(dest))
                    moved.append(f"🔄 {file_path.name} → utilities/")
                    
            # Check backend directory
            backend_dir = self.project_root / "backend"
            if backend_dir.exists():
                for file_path in backend_dir.glob(pattern):
                    if file_path.is_file():
                        dest = self.utilities / file_path.name
                        shutil.move(str(file_path), str(dest))
                        moved.append(f"🔄 backend/{file_path.name} → utilities/")
                        
        # Move railway.json from root to backend (if exists in root)
        root_railway = self.project_root / "railway.json"
        backend_railway = self.project_root / "backend" / "railway.json"
        if root_railway.exists() and root_railway.is_file():
            if backend_railway.exists():
                backend_railway.unlink()  # Remove old one
            shutil.move(str(root_railway), str(backend_railway))
            moved.append(f"⚙️  railway.json → backend/ (deployment config)")
            
        # Move migration directories
        for dir_name in ["migration_logs", "database_migration"]:
            src_dir = self.project_root / "backend" / dir_name
            if src_dir.exists() and src_dir.is_dir():
                dest_dir = self.utilities / dir_name
                if dest_dir.exists():
                    shutil.rmtree(dest_dir)
                shutil.move(str(src_dir), str(dest_dir))
                moved.append(f"📁 backend/{dir_name}/ → utilities/")
                
        return moved
        
    def _clean_temp_files(self):
        """Clean up temporary and log files"""
        temp_patterns = [
            "*.log", "*.tmp", "run_*.bat", "run_*.ps1",
            "cleanup_*.ps1", "*.pyc", "__pycache__"
        ]
        
        deleted = []
        for pattern in temp_patterns:
            for file_path in self.project_root.rglob(pattern):
                if file_path.is_file():
                    file_path.unlink()
                    deleted.append(f"🧹 {file_path.name} (temp file)")
                elif file_path.is_dir() and pattern == "__pycache__":
                    shutil.rmtree(file_path)
                    deleted.append(f"🧹 {file_path.name}/ (cache directory)")
                    
        return deleted
        
    def _print_summary(self, moved_files, deleted_files):
        """Print organization summary"""
        print("\n" + "="*60)
        print("📊 PROJECT ORGANIZATION SUMMARY")
        print("="*60)
        
        if moved_files:
            print(f"\n✅ MOVED FILES ({len(moved_files)}):")
            for item in moved_files:
                print(f"  {item}")
        else:
            print("\n✅ No files needed to be moved")
            
        if deleted_files:
            print(f"\n🗑️  DELETED FILES ({len(deleted_files)}):")
            for item in deleted_files:
                print(f"  {item}")
        else:
            print("\n🗑️  No files needed to be deleted")
            
        print(f"\n🎯 PROJECT STRUCTURE: ✅ PROFESSIONAL & ORGANIZED")
        print("="*60)
        
    def verify_structure(self):
        """Verify project structure compliance"""
        print("🔍 Verifying Project Structure...")
        
        issues = []
        
        # Check for misplaced test files
        test_files_root = list(self.project_root.glob("test_*.py"))
        debug_files_root = list(self.project_root.glob("debug_*.py"))
        
        if test_files_root:
            issues.append(f"❌ Test files in root: {[f.name for f in test_files_root]}")
        if debug_files_root:
            issues.append(f"❌ Debug files in root: {[f.name for f in debug_files_root]}")
            
        # Check for Docker files
        docker_files = list(self.project_root.glob("Dockerfile*")) + list(self.project_root.glob("docker-compose.*"))
        if docker_files:
            issues.append(f"❌ Docker files found: {[f.name for f in docker_files]}")
            
        # Check for required directories
        required_dirs = ["backend", "frontend", "test-documents", "utilities"]
        for dir_name in required_dirs:
            if not (self.project_root / dir_name).exists():
                issues.append(f"❌ Missing required directory: {dir_name}/")
                
        # Check for required files
        required_files = [
            "README.md",
            "backend/requirements.txt", 
            "backend/railway.json",
            "frontend/package.json",
            "frontend/vercel.json"
        ]
        
        for file_path in required_files:
            if not (self.project_root / file_path).exists():
                issues.append(f"❌ Missing required file: {file_path}")
                
        if issues:
            print("\n🚨 STRUCTURE ISSUES FOUND:")
            for issue in issues:
                print(f"  {issue}")
            print("\n💡 Run organize_files() to fix these issues")
        else:
            print("\n✅ PROJECT STRUCTURE: PERFECT!")
            
        return len(issues) == 0

def main():
    """Main function"""
    organizer = ProjectOrganizer()
    
    print("🏗️  PROJECT STRUCTURE MAINTENANCE TOOL")
    print("=====================================")
    
    # First verify current structure
    is_compliant = organizer.verify_structure()
    
    if not is_compliant:
        print("\n🔧 Auto-organizing files...")
        organizer.organize_files()
        print("\n🔍 Re-verifying structure...")
        organizer.verify_structure()
    else:
        print("\n🎉 Project structure is already perfect!")
        
    print("\n💡 TIP: Run this script after adding new files to maintain organization")

if __name__ == "__main__":
    main()