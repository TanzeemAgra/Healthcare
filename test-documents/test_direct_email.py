#!/usr/bin/env python
"""
Simplified Email Notification Test for Admin Creation
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import boto3
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone

def send_admin_email_directly(admin_email, admin_name, temp_password, created_by):
    """Send admin account creation email directly using AWS SES"""
    print(f"📧 Sending admin account email to: {admin_email}")
    
    try:
        # Initialize AWS SES client
        ses_client = boto3.client(
            'ses',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_SES_REGION
        )
        
        # Context for the email template
        context = {
            'admin_name': admin_name,
            'admin_email': admin_email,
            'temp_password': temp_password,
            'department': 'Administration',
            'creation_date': timezone.now().strftime('%Y-%m-%d %H:%M:%S'),
            'created_by': created_by,
            'platform_name': getattr(settings, 'PLATFORM_NAME', 'Healthcare Platform'),
            'support_email': getattr(settings, 'SUPPORT_EMAIL', 'info@xerxez.in'),
            'login_url': f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/login"
        }
        
        # Render the email template
        html_content = render_to_string('notifications/email/admin_account_created.html', context)
        
        # Send email via AWS SES
        response = ses_client.send_email(
            Source=settings.AWS_SES_FROM_EMAIL,
            Destination={'ToAddresses': [admin_email]},
            Message={
                'Subject': {'Data': f"🎉 Admin Account Created - Welcome to {context['platform_name']}", 'Charset': 'UTF-8'},
                'Body': {'Html': {'Data': html_content, 'Charset': 'UTF-8'}}
            }
        )
        
        print(f"✅ Email sent successfully!")
        print(f"📨 Message ID: {response['MessageId']}")
        return {'success': True, 'message_id': response['MessageId']}
        
    except Exception as e:
        print(f"❌ Email failed: {e}")
        return {'success': False, 'error': str(e)}

if __name__ == "__main__":
    print("🧪 Direct Admin Email Test")
    print("="*40)
    
    # Test email - use a real email address to verify
    test_email = input("Enter email address to test (or press Enter to skip): ").strip()
    
    if test_email:
        result = send_admin_email_directly(
            admin_email=test_email,
            admin_name="Test Admin User",
            temp_password="TempPassword123!",
            created_by="Super Administrator"
        )
        
        if result['success']:
            print("\n🎉 DIRECT EMAIL TEST SUCCESSFUL!")
            print("📧 Check your inbox for the admin account creation email")
        else:
            print(f"\n❌ Email test failed: {result['error']}")
    else:
        print("⏭️  Skipping email test")
        
    print("\n📋 This function can be used directly in the user creation view!")
    print("🔧 Copy this function to user_management_views.py for immediate email notifications")
