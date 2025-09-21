#!/usr/bin/env python3
"""
Create Test Super Admin Script
This script creates a super admin account for testing user creation functionality
"""
import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('D:/alfiya/backend')

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from hospital.models import CustomUser as User, AdminPermissions, AdminDashboardFeatures
from django.contrib.auth.hashers import make_password
from django.utils import timezone

def create_super_admin():
    """Create a test super admin account"""
    
    # Test super admin credentials
    email = "superadmin@test.com"
    password = "superadmin123"
    full_name = "Test Super Admin"
    
    print("🔧 Creating test super admin account...")
    print(f"📧 Email: {email}")
    print(f"🔑 Password: {password}")
    print(f"👤 Name: {full_name}")
    
    try:
        # Check if user already exists
        if User.objects.filter(email=email).exists():
            print("⚠️ Super admin account already exists, updating...")
            user = User.objects.get(email=email)
            user.set_password(password)
            user.role = 'super_admin'
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.is_verified = True
            user.save()
        else:
            # Create new super admin
            user = User.objects.create(
                email=email,
                password=make_password(password),
                full_name=full_name,
                role='super_admin',
                is_superuser=True,
                is_staff=True,
                is_active=True,
                is_verified=True,
                phone_number='+1234567890',
                date_joined=timezone.now()
            )
            print("✅ Super admin account created successfully!")
        
        # Create or update admin permissions (super admin gets all permissions)
        admin_permissions, created = AdminPermissions.objects.get_or_create(
            user=user,
            defaults={
                'can_manage_users': True,
                'can_view_reports': True,
                'can_manage_departments': True,
                'can_access_billing': True,
                'can_manage_inventory': True,
                'can_access_emergency': True
            }
        )
        
        if not created:
            # Update existing permissions
            admin_permissions.can_manage_users = True
            admin_permissions.can_view_reports = True
            admin_permissions.can_manage_departments = True
            admin_permissions.can_access_billing = True
            admin_permissions.can_manage_inventory = True
            admin_permissions.can_access_emergency = True
            admin_permissions.save()
        
        print("✅ Admin permissions configured!")
        
        # Create dashboard features (super admin gets all features)
        dashboard_features, created = AdminDashboardFeatures.objects.get_or_create(
            user=user,
            defaults={
                'user_management': True,
                'patient_management': True,
                'doctor_management': True,
                'nurse_management': True,
                'pharmacist_management': True,
                'hospital_management': True,
                'clinic_management': True,
                'subscription_management': True,
                'billing_reports': True,
                'financial_dashboard': True,
                'system_settings': True,
                'audit_logs': True,
                'user_analytics': True,
                'medical_reports': True,
                'revenue_reports': True,
                'appointment_analytics': True,
                'inventory_reports': True,
                'create_user': True
            }
        )
        
        if not created:
            # Update existing features
            for field in dashboard_features._meta.fields:
                if field.name not in ['id', 'user', 'created_at', 'updated_at']:
                    setattr(dashboard_features, field.name, True)
            dashboard_features.save()
        
        print("✅ Dashboard features configured!")
        
        print("\n🎉 Test super admin account ready!")
        print("\n📋 Login Credentials:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
        print(f"   Role: super_admin")
        print("\n🌐 Next Steps:")
        print("   1. Go to http://localhost:5173/login")
        print("   2. Login with the credentials above")
        print("   3. Navigate to http://localhost:5173/admin/user-management")
        print("   4. Create admin users!")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creating super admin: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

def test_login():
    """Test the login functionality"""
    import requests
    import json
    
    login_url = "http://127.0.0.1:8000/api/hospital/login/"
    
    login_data = {
        "email": "superadmin@test.com",
        "password": "superadmin123"
    }
    
    print("\n🔍 Testing login functionality...")
    print(f"📡 Login URL: {login_url}")
    
    try:
        # Get CSRF token first
        session = requests.Session()
        csrf_url = "http://127.0.0.1:8000/api/auth/csrf-token/"
        csrf_response = session.get(csrf_url)
        
        if csrf_response.status_code == 200:
            csrf_data = csrf_response.json()
            csrf_token = csrf_data.get('csrf_token')
            
            headers = {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrf_token,
                'Referer': 'http://127.0.0.1:8000/'
            }
            
            response = session.post(login_url, json=login_data, headers=headers)
            
            print(f"📊 Login response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print("✅ Login successful!")
                print(f"📄 Response: {json.dumps(data, indent=2)}")
            else:
                print(f"❌ Login failed: {response.text}")
        else:
            print(f"❌ Failed to get CSRF token: {csrf_response.text}")
            
    except Exception as e:
        print(f"❌ Login test failed: {str(e)}")

if __name__ == "__main__":
    print("🚀 Setting up test super admin account...")
    user = create_super_admin()
    
    if user:
        print("\n🧪 Testing login...")
        test_login()
    
    print("\n✅ Setup complete!")
