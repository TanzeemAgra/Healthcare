#!/usr/bin/env python
"""
Quick Email Test Script for AWS SES
Tests email sending with the verified sender: info@xerxez.in
"""

import os
import sys
import django
from pathlib import Path

# Add the backend directory to the Python path
backend_dir = Path(__file__).resolve().parent
sys.path.append(str(backend_dir))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospital.aws_notification_service import AWSNotificationService
from hospital.notification_system import HealthcareNotificationManager

def test_verified_email():
    """Test email sending with verified sender email"""
    print("🧪 Testing AWS SES with verified sender: info@xerxez.in")
    print("="*60)
    
    try:
        # Initialize the notification manager
        notification_manager = HealthcareNotificationManager()
        
        print("✅ Notification manager initialized successfully")
        
        # Test basic email sending
        test_recipient = input("Enter test recipient email (or press Enter for info@xerxez.in): ").strip()
        if not test_recipient:
            test_recipient = "info@xerxez.in"  # Send to yourself for testing
        
        print(f"📧 Sending test email to: {test_recipient}")
        
        # Send a simple test email
        result = notification_manager.aws_service.send_email_notification(
            recipients=[test_recipient],
            subject="🏥 AWS SES Test - Healthcare Platform",
            template_name='registration_confirmation.html',  # Use existing template
            context={
                'user_name': 'Test User',
                'platform_name': 'Healthcare Platform',
                'registration_date': '2024-12-03',
                'support_email': 'info@xerxez.in'
            },
            priority='normal'
        )
        
        print("\n📊 Test Results:")
        print(f"Success: {result.get('success', False)}")
        if result.get('success'):
            print(f"✅ Email sent successfully!")
            print(f"📧 From: info@xerxez.in")
            print(f"📧 To: {test_recipient}")
            print(f"🆔 Message ID: {result.get('message_id', 'N/A')}")
        else:
            print(f"❌ Email failed: {result.get('error', 'Unknown error')}")
        
        return result
        
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")
        print(f"🔧 Error type: {type(e).__name__}")
        return {'success': False, 'error': str(e)}

def test_healthcare_notification():
    """Test healthcare-specific notification"""
    print("\n🏥 Testing Healthcare Registration Notification")
    print("="*60)
    
    try:
        notification_manager = HealthcareNotificationManager()
        
        # Test registration confirmation
        user_data = {
            'email': 'info@xerxez.in',  # Send to your verified email
            'first_name': 'Test',
            'last_name': 'Doctor'
        }
        
        result = notification_manager.send_registration_confirmation(user_data)
        
        print(f"📊 Healthcare Notification Result:")
        print(f"Success: {result.get('success', False)}")
        if result.get('success'):
            print(f"✅ Registration notification sent!")
        else:
            print(f"❌ Notification failed: {result.get('error', 'Unknown error')}")
        
        return result
        
    except Exception as e:
        print(f"❌ Healthcare notification test failed: {str(e)}")
        return {'success': False, 'error': str(e)}

def main():
    print("🚀 AWS SES Email Testing with Verified Sender")
    print("🔐 Verified Sender: info@xerxez.in")
    print("="*60)
    
    # Check configuration
    from django.conf import settings
    print(f"📧 Configured FROM email: {getattr(settings, 'AWS_SES_FROM_EMAIL', 'Not set')}")
    print(f"🌍 AWS Region: {getattr(settings, 'AWS_REGION', 'Not set')}")
    print(f"🔑 AWS Access Key ID: {'Set' if getattr(settings, 'AWS_ACCESS_KEY_ID', None) else 'Not set'}")
    print()
    
    # Run tests
    print("1️⃣ Running basic email test...")
    basic_result = test_verified_email()
    
    print("\n2️⃣ Running healthcare notification test...")
    healthcare_result = test_healthcare_notification()
    
    # Summary
    print("\n📋 TEST SUMMARY")
    print("="*60)
    print(f"Basic Email Test: {'✅ PASSED' if basic_result.get('success') else '❌ FAILED'}")
    print(f"Healthcare Notification: {'✅ PASSED' if healthcare_result.get('success') else '❌ FAILED'}")
    
    if not basic_result.get('success') or not healthcare_result.get('success'):
        print("\n🔧 TROUBLESHOOTING:")
        print("1. Ensure AWS credentials are set in .env file")
        print("2. Verify info@xerxez.in is verified in AWS SES console")
        print("3. Check AWS region is correct (us-east-1)")
        print("4. Verify AWS IAM permissions for SES")
        print("5. Run: python manage.py configure_aws_notifications --interactive")

if __name__ == "__main__":
    main()
