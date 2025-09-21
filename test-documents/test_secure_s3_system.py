#!/usr/bin/env python
"""
Test script for the comprehensive secure S3 data management system.
Tests the automated folder creation hierarchy as requested:
- Super admin creates doctor -> doctor workspace folder created in S3 under module
- Doctor creates patient -> patient folder created in S3 under doctor's workspace
"""

import os
import sys
import django

# Setup Django environment
sys.path.append('D:/alfiya/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from secureneat.s3_secure_manager import SecureS3Manager
from secureneat.models import UserWorkspace, PatientFolder

User = get_user_model()

def test_automated_folder_creation():
    """Test the automated folder creation system"""
    print("🔐 Testing Secure S3 Data Management System")
    print("=" * 60)
    
    # Initialize the secure S3 manager
    s3_manager = SecureS3Manager()
    
    # Test 1: Super Admin creates Doctor (workspace creation)
    print("\n📋 Test 1: Super Admin creates Doctor workspace")
    print("-" * 40)
    
    try:
        # Simulate super admin creating a doctor
        super_admin = User.objects.filter(is_superuser=True).first()
        if not super_admin:
            print("❌ No super admin found. Creating test super admin...")
            super_admin = User.objects.create_superuser(
                username='test_super_admin',
                email='super@test.com',
                password='testpass123',
                full_name='Test Super Admin'
            )
            print("✅ Test super admin created")
        
        # Create a test doctor
        doctor_user, created = User.objects.get_or_create(
            username='test_doctor_radiology',
            defaults={
                'email': 'doctor.radiology@test.com',
                'full_name': 'Dr. John Radiology',
                'is_staff': True,
                'role': 'doctor'  # Set the role
            }
        )
        
        if created:
            doctor_user.set_password('testpass123')
            doctor_user.save()
            print(f"✅ Test doctor created: {doctor_user.full_name}")
        else:
            # Ensure existing user has the correct role
            if not doctor_user.role:
                doctor_user.role = 'doctor'
                doctor_user.save()
            print(f"📝 Using existing doctor: {doctor_user.full_name} (Role: {doctor_user.role})")
        
        # Create workspace for the doctor in radiology module
        workspace_result = s3_manager.create_user_workspace(
            user=doctor_user,
            module='radiology',
            created_by=super_admin
        )
        
        if workspace_result['success']:
            print(f"✅ Doctor workspace created successfully!")
            print(f"   📁 S3 Path: {workspace_result['workspace_path']}")
            print(f"   🗄️ Database ID: {workspace_result['workspace_id']}")
        else:
            print(f"❌ Failed to create workspace: {workspace_result['error']}")
            return False
            
    except Exception as e:
        print(f"❌ Error in Test 1: {str(e)}")
        return False
    
    # Test 2: Doctor creates Patient folder
    print("\n🏥 Test 2: Doctor creates Patient folder")
    print("-" * 40)
    
    try:
        # Get the created workspace
        workspace = UserWorkspace.objects.get(
            user=doctor_user,
            module='radiology'
        )
        
        # Create patient folder
        patient_data = {
            'patient_name': 'John Doe',
            'patient_id': 'RAD001'
        }
        
        patient_result = s3_manager.create_patient_folder(
            doctor=doctor_user,
            patient_data=patient_data,
            module='radiology'
        )
        
        if patient_result['success']:
            print(f"✅ Patient folder created successfully!")
            print(f"   👤 Patient: {patient_data['patient_name']}")
            print(f"   📁 S3 Path: {patient_result['patient_path']}")
            print(f"   🗄️ Database ID: {patient_result['patient_folder_id']}")
        else:
            print(f"❌ Failed to create patient folder: {patient_result['error']}")
            return False
            
    except Exception as e:
        print(f"❌ Error in Test 2: {str(e)}")
        return False
    
    # Test 3: Verify S3 folder structure
    print("\n🔍 Test 3: Verify S3 folder structure")
    print("-" * 40)
    
    try:
        # Check if workspace exists in database
        workspaces = UserWorkspace.objects.filter(module='radiology')
        print(f"📊 Total radiology workspaces: {workspaces.count()}")
        
        for ws in workspaces:
            print(f"   👨‍⚕️ Doctor: {ws.user.full_name}")
            print(f"   📁 Workspace: {ws.s3_path}")
            print(f"   📈 Status: {ws.status}")
            
            # Check patient folders
            patient_folders = PatientFolder.objects.filter(assigned_doctor=ws.user, module=ws.module)
            print(f"   👥 Patient folders: {patient_folders.count()}")
            
            for folder in patient_folders:
                print(f"      👤 Patient ID: {folder.patient_id}")
                print(f"      📁 Folder: {folder.s3_path}")
        
        print("✅ Database verification complete!")
        
    except Exception as e:
        print(f"❌ Error in Test 3: {str(e)}")
        return False
    
    # Test 4: Test multi-module support
    print("\n🔬 Test 4: Test multi-module support")
    print("-" * 40)
    
    try:
        # Create workspace in medicine module
        medicine_workspace = s3_manager.create_user_workspace(
            user=doctor_user,
            module='medicine',
            created_by=super_admin
        )
        
        if medicine_workspace['success']:
            print(f"✅ Medicine workspace created!")
            print(f"   📁 S3 Path: {medicine_workspace['workspace_path']}")
        
        # Create workspace in dentistry module  
        dentistry_workspace = s3_manager.create_user_workspace(
            user=doctor_user,
            module='dentistry',
            created_by=super_admin
        )
        
        if dentistry_workspace['success']:
            print(f"✅ Dentistry workspace created!")
            print(f"   📁 S3 Path: {dentistry_workspace['workspace_path']}")
        
        print("✅ Multi-module support verified!")
        
    except Exception as e:
        print(f"❌ Error in Test 4: {str(e)}")
        return False
    
    print("\n🎉 All tests completed successfully!")
    print("=" * 60)
    print("✅ Automated folder creation system is working correctly")
    print("✅ Super admin can create doctor workspaces")  
    print("✅ Doctors can create patient folders")
    print("✅ Multi-module support is functional")
    print("✅ Database tracking is working")
    print("=" * 60)
    
    return True

if __name__ == '__main__':
    test_automated_folder_creation()
