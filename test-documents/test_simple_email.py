#!/usr/bin/env python
"""
Quick Email Test to verify email notifications work
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_simple_email():
    """Test simple email sending"""
    print("🧪 Testing Simple Email Notification")
    print("="*50)
    
    try:
        # Test recipient (use your email for testing)
        test_email = input("Enter your email to test: ").strip()
        if not test_email:
            print("❌ No email provided")
            return
            
        print(f"📧 Sending test email to: {test_email}")
        print(f"📤 From: {settings.EMAIL_HOST_USER}")
        print(f"🌐 SMTP Host: {settings.EMAIL_HOST}")
        
        # Send test email
        result = send_mail(
            subject='🏥 Healthcare Platform - Email Test',
            message='This is a test email to verify email notifications are working.\n\nIf you receive this, the email system is functioning correctly!',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[test_email],
            fail_silently=False,
        )
        
        if result:
            print("✅ Email sent successfully!")
            print("📱 Check your inbox (and spam folder)")
        else:
            print("❌ Email sending failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n🔧 Troubleshooting:")
        print("1. Check email credentials in .env file")
        print("2. Verify Gmail app password is correct")
        print("3. Ensure less secure app access is enabled")

if __name__ == "__main__":
    test_simple_email()
