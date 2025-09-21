#!/usr/bin/env python
"""
Test AWS SES Email Service
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

def test_aws_ses_direct():
    """Test AWS SES directly"""
    print("🧪 Testing AWS SES Direct Connection")
    print("="*50)
    
    try:
        # Initialize AWS SES client
        ses_client = boto3.client(
            'ses',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_SES_REGION
        )
        
        print("✅ AWS SES Client initialized successfully")
        
        # Test email recipient
        test_email = input("Enter email to test (or press Enter to skip): ").strip()
        if not test_email:
            print("⏭️  Skipping email test")
            return
            
        print(f"📧 Sending test email to: {test_email}")
        
        # Send test email
        response = ses_client.send_email(
            Source=settings.AWS_SES_FROM_EMAIL,
            Destination={'ToAddresses': [test_email]},
            Message={
                'Subject': {'Data': '🧪 AWS SES Test - Healthcare Platform', 'Charset': 'UTF-8'},
                'Body': {
                    'Html': {
                        'Data': '''
                        <h2>🧪 AWS SES Test Email</h2>
                        <p>This is a test email from Healthcare Platform using AWS SES.</p>
                        <p>If you receive this email, AWS SES is working correctly!</p>
                        <br>
                        <p><strong>Test Details:</strong></p>
                        <ul>
                            <li>Service: AWS SES</li>
                            <li>Region: ap-south-1</li>
                            <li>From: info@xerxez.in</li>
                        </ul>
                        ''',
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        
        print(f"✅ Email sent successfully!")
        print(f"📨 Message ID: {response['MessageId']}")
        print("📱 Check your inbox (and spam folder)")
        
        return True
        
    except Exception as e:
        print(f"❌ AWS SES Error: {e}")
        
        if "InvalidParameterValue" in str(e):
            print("\n🔧 Possible fixes:")
            print("1. Verify sender email (info@xerxez.in) in AWS SES Console")
            print("2. Check AWS credentials in .env file")
            print("3. Ensure SES is available in ap-south-1 region")
        
        return False

if __name__ == "__main__":
    success = test_aws_ses_direct()
    
    if success:
        print("\n🎉 AWS SES is working! You can use it for admin notifications.")
        print("\n🔄 To switch to AWS SES for all emails:")
        print("1. Update .env: EMAIL_BACKEND=django_ses.SESBackend")
        print("2. Or continue using current setup for notifications")
    else:
        print("\n❌ AWS SES needs configuration. Check AWS Console.")
        print("Alternative: Fix Gmail App Password for immediate email notifications.")
