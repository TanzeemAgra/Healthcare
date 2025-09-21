#!/usr/bin/env python3
"""
Test script for enhanced registration email functionality with AWS SES integration
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospital.notification_system import notification_manager

def test_registration_emails():
    """Test both registration confirmation and admin approval emails"""
    
    # Create test user data
    test_registration_data = {
        'email': 'tanzeem.agra@rugrel.com',
        'first_name': 'Dr. Ahmed',
        'last_name': 'Khan',
        'specialization': 'Cardiology',
        'years_of_experience': '8',
        'phone_number': '+91-9876543210',
        'registration_type': 'Premium Doctor',
        'additional_info': 'Board certified cardiologist with expertise in interventional procedures',
        'license_number': 'MD12345',
        'license_authority': 'Indian Medical Council',
        'current_workplace': 'Delhi Heart Institute'
    }
    
    print("🔬 Testing Enhanced Registration Email System")
    print("=" * 50)
    
    # Test 1: Registration Confirmation Email
    print("\n1️⃣  Testing Registration Confirmation Email...")
    print(f"   📧 Sending to: {test_registration_data['email']}")
    
    try:
        result = notification_manager.send_registration_confirmation(test_registration_data)
        print(f"   ✅ Result: {result}")
        
        if result.get('success'):
            print(f"   📨 Message ID: {result.get('message_id')}")
            print("   🎉 Registration confirmation email sent successfully!")
        else:
            print(f"   ❌ Error: {result.get('error')}")
            
    except Exception as e:
        print(f"   💥 Exception: {str(e)}")
    
    # Test 2: Admin Approval Notification Email  
    print("\n2️⃣  Testing Admin Approval Notification Email...")
    print("   👨‍💼 Sending to admin...")
    
    try:
        admin_result = notification_manager.send_admin_approval_notification(test_registration_data)
        print(f"   ✅ Result: {admin_result}")
        
        if admin_result.get('success'):
            print(f"   📨 Message ID: {admin_result.get('message_id')}")
            print("   🎉 Admin approval notification sent successfully!")
        else:
            print(f"   ❌ Error: {admin_result.get('error')}")
            
    except Exception as e:
        print(f"   💥 Exception: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🏁 Email Testing Complete!")
    
    return {
        'registration_email': result if 'result' in locals() else None,
        'admin_email': admin_result if 'admin_result' in locals() else None
    }

def verify_aws_ses_integration():
    """Verify AWS SES integration status"""
    print("\n🔍 Verifying AWS SES Integration...")
    print("-" * 30)
    
    try:
        # Check if AWS service is properly initialized
        aws_service = notification_manager.aws_service
        print(f"   🔧 AWS SES Enabled: {aws_service.aws_enabled}")
        
        if aws_service.aws_enabled:
            print("   ✅ AWS SES Client: Successfully initialized")
            print("   🌍 Region: ap-south-1 (Asia Pacific - Mumbai)")
            print("   📧 Verified Emails: tanzeem.agra@rugrel.com, info@xerxez.in")
        else:
            print("   ⚠️  AWS SES Client: Fallback to Django email")
            
    except Exception as e:
        print(f"   💥 Error checking AWS integration: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Enhanced Registration Email Tests")
    print("=" * 60)
    
    # Verify AWS SES integration first
    verify_aws_ses_integration()
    
    # Run email tests
    results = test_registration_emails()
    
    print(f"\n📊 Test Summary:")
    print(f"   Registration Email: {'✅ Success' if results.get('registration_email', {}).get('success') else '❌ Failed'}")
    print(f"   Admin Email: {'✅ Success' if results.get('admin_email', {}).get('success') else '❌ Failed'}")
