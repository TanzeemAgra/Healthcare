#!/usr/bin/env python3
"""
Test script to verify email notification system for registration
"""

import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import logging
from hospital.notification_system import notification_manager

# Setup logging to see what's happening
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_email_system():
    """Test the entire email notification system"""
    
    print("🔬 Testing Registration Email Notification System")
    print("=" * 60)
    
    # Test user data similar to registration
    test_registration_data = {
        'email': 'tanzeem.agra@rugrel.com',
        'first_name': 'Dr. Ahmed',
        'last_name': 'Khan',
        'specialization': 'Cardiology',
        'years_of_experience': '8',
        'phone_number': '+91-9876543210',
        'registration_type': 'Premium Doctor',
        'additional_info': 'Board certified cardiologist',
        'license_number': 'MD12345',
        'license_authority': 'Indian Medical Council',
        'current_workplace': 'Delhi Heart Institute'
    }
    
    print(f"📧 Testing with email: {test_registration_data['email']}")
    print(f"👤 User: {test_registration_data['first_name']} {test_registration_data['last_name']}")
    
    # Test 1: Check AWS SES Integration
    print("\n1️⃣  Testing AWS SES Integration...")
    try:
        aws_service = notification_manager.aws_service
        print(f"   🔧 AWS SES Enabled: {aws_service.aws_enabled}")
        
        if aws_service.aws_enabled:
            print("   ✅ AWS SES Client: Successfully initialized")
            print("   🌍 Region: ap-south-1 (Asia Pacific - Mumbai)")
            print("   📧 Using verified emails")
        else:
            print("   ⚠️  AWS SES Client: Fallback to Django email")
            
    except Exception as e:
        print(f"   💥 Error checking AWS integration: {str(e)}")
    
    # Test 2: Registration Confirmation Email
    print("\n2️⃣  Testing Registration Confirmation Email...")
    try:
        result = notification_manager.send_registration_confirmation(test_registration_data)
        print(f"   📊 Result: {result}")
        
        if result.get('success'):
            print(f"   ✅ SUCCESS: Email sent!")
            print(f"   📨 Message ID: {result.get('message_id', 'N/A')}")
            print(f"   📧 Template: registration_confirmation_enhanced.html")
        else:
            print(f"   ❌ FAILED: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"   💥 Exception during registration email: {str(e)}")
        import traceback
        traceback.print_exc()
    
    # Test 3: Admin Approval Notification
    print("\n3️⃣  Testing Admin Approval Notification...")
    try:
        admin_result = notification_manager.send_admin_approval_notification(test_registration_data)
        print(f"   📊 Result: {admin_result}")
        
        if admin_result.get('success'):
            print(f"   ✅ SUCCESS: Admin notification sent!")
            print(f"   📨 Message ID: {admin_result.get('message_id', 'N/A')}")
            print(f"   📧 Template: admin_registration_approval.html")
        else:
            print(f"   ❌ FAILED: {admin_result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"   💥 Exception during admin email: {str(e)}")
        import traceback
        traceback.print_exc()
    
    # Test 4: Check Django Settings
    print("\n4️⃣  Checking Django Email Settings...")
    try:
        from django.conf import settings
        
        print(f"   📮 AWS_ACCESS_KEY_ID: {'✅ Set' if hasattr(settings, 'AWS_ACCESS_KEY_ID') and settings.AWS_ACCESS_KEY_ID else '❌ Missing'}")
        print(f"   🔑 AWS_SECRET_ACCESS_KEY: {'✅ Set' if hasattr(settings, 'AWS_SECRET_ACCESS_KEY') and settings.AWS_SECRET_ACCESS_KEY else '❌ Missing'}")
        print(f"   🌍 AWS_SES_REGION: {getattr(settings, 'AWS_SES_REGION', '❌ Not set')}")
        print(f"   📧 AWS_SES_FROM_EMAIL: {getattr(settings, 'AWS_SES_FROM_EMAIL', '❌ Not set')}")
        
        # Test Django fallback email settings
        print(f"   📬 EMAIL_BACKEND: {getattr(settings, 'EMAIL_BACKEND', '❌ Not set')}")
        print(f"   📨 DEFAULT_FROM_EMAIL: {getattr(settings, 'DEFAULT_FROM_EMAIL', '❌ Not set')}")
        
    except Exception as e:
        print(f"   💥 Error checking settings: {str(e)}")
    
    # Test 5: Direct AWS SES Test
    print("\n5️⃣  Testing Direct AWS SES Connection...")
    try:
        import boto3
        from django.conf import settings
        
        ses_client = boto3.client(
            'ses',
            aws_access_key_id=getattr(settings, 'AWS_ACCESS_KEY_ID', None),
            aws_secret_access_key=getattr(settings, 'AWS_SECRET_ACCESS_KEY', None),
            region_name=getattr(settings, 'AWS_SES_REGION', 'ap-south-1')
        )
        
        # Test with a simple email
        response = ses_client.send_email(
            Source='info@xerxez.in',
            Destination={'ToAddresses': ['tanzeem.agra@rugrel.com']},
            Message={
                'Subject': {'Data': '🧪 Registration Email Test', 'Charset': 'UTF-8'},
                'Body': {
                    'Html': {
                        'Data': '''
                        <h2>Registration Email Test</h2>
                        <p>This is a test email to verify the registration notification system is working.</p>
                        <p><strong>Test Details:</strong></p>
                        <ul>
                            <li>Date: September 4, 2025</li>
                            <li>System: Registration Email Verification</li>
                            <li>Status: Testing AWS SES Integration</li>
                        </ul>
                        <p>If you receive this email, the system is working correctly!</p>
                        ''',
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        
        print(f"   ✅ Direct AWS SES test successful!")
        print(f"   📨 Message ID: {response['MessageId']}")
        print(f"   📧 Check your email: tanzeem.agra@rugrel.com")
        
    except Exception as e:
        print(f"   ❌ Direct AWS SES test failed: {str(e)}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 60)
    print("🏁 Email System Test Complete!")
    print("\n📋 Summary:")
    print("   • If you received the test email, AWS SES is working")
    print("   • If registration emails aren't working, check the server logs")
    print("   • Verify the registration form is actually calling the backend API")
    print("   • Check that notification_manager.send_registration_confirmation() is being called")

if __name__ == "__main__":
    test_email_system()
