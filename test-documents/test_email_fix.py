#!/usr/bin/env python
"""
Email Configuration Test and Fix Tool
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings
import smtplib

def test_email_credentials():
    """Test email credentials and suggest fixes"""
    print("🔧 Email Configuration Diagnostic Tool")
    print("="*50)
    
    print("📋 Current Email Settings:")
    print(f"EMAIL_HOST: {settings.EMAIL_HOST}")
    print(f"EMAIL_PORT: {settings.EMAIL_PORT}")
    print(f"EMAIL_USE_TLS: {settings.EMAIL_USE_TLS}")
    print(f"EMAIL_HOST_USER: {settings.EMAIL_HOST_USER}")
    print(f"EMAIL_HOST_PASSWORD: {'*' * len(settings.EMAIL_HOST_PASSWORD) if settings.EMAIL_HOST_PASSWORD else 'Not Set'}")
    
    print("\n🧪 Testing SMTP Connection...")
    
    try:
        # Test direct SMTP connection
        smtp_server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        smtp_server.starttls()
        smtp_server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        smtp_server.quit()
        
        print("✅ SMTP Connection: SUCCESS")
        
        # Test Django email
        print("\n📧 Testing Django Email...")
        result = send_mail(
            subject='🧪 Healthcare Platform - Email Test',
            message='This is a test email. If you receive this, email notifications are working!',
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[settings.EMAIL_HOST_USER],  # Send to self
            fail_silently=False,
        )
        
        if result:
            print("✅ Django Email: SUCCESS")
            print("🎉 Email system is working correctly!")
            return True
        else:
            print("❌ Django Email: FAILED")
            
    except smtplib.SMTPAuthenticationError as e:
        print(f"❌ SMTP Authentication Error: {e}")
        print("\n🔧 Suggested Fixes:")
        print("1. For Gmail: Use App Password instead of regular password")
        print("   - Go to Google Account Settings > Security > 2-Step Verification")
        print("   - Generate App Password for 'Mail'")
        print("   - Use that password in EMAIL_HOST_PASSWORD")
        print("\n2. Enable 2-Step Verification in Gmail")
        print("3. Or use a different email provider (e.g., SendGrid, AWS SES)")
        
    except smtplib.SMTPConnectError as e:
        print(f"❌ SMTP Connection Error: {e}")
        print("\n🔧 Check network connectivity and SMTP settings")
        
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        
    return False

def suggest_alternatives():
    """Suggest alternative email configurations"""
    print("\n🚀 Alternative Email Solutions:")
    print("1. Gmail App Password (Recommended)")
    print("2. AWS SES (Already configured)")
    print("3. SendGrid")
    print("4. Outlook/Hotmail SMTP")
    
    print("\n🔄 To use AWS SES instead:")
    print("Update .env file:")
    print("EMAIL_BACKEND=django_ses.SESBackend")
    print("AWS_SES_REGION=ap-south-1")
    
def test_aws_ses():
    """Test AWS SES if available"""
    print("\n🧪 Testing AWS SES...")
    try:
        from hospital.notification_system import AWSNotificationService
        
        aws_service = AWSNotificationService()
        if aws_service.aws_enabled:
            print("✅ AWS SES Service: Available")
            
            # Test sending email via AWS SES
            result = aws_service.send_email_notification(
                recipients=[settings.EMAIL_HOST_USER],
                subject="🧪 AWS SES Test - Healthcare Platform",
                template_name='registration_confirmation.html',
                context={
                    'user_name': 'Test User',
                    'platform_name': 'Healthcare Platform',
                    'registration_date': '2024-12-04',
                    'support_email': settings.EMAIL_HOST_USER
                }
            )
            
            if result.get('success'):
                print("✅ AWS SES Email: SUCCESS")
                print("🎉 AWS SES is working! Consider using it as primary email service.")
                return True
            else:
                print(f"❌ AWS SES Email: FAILED - {result.get('error')}")
        else:
            print("❌ AWS SES: Not available")
            
    except Exception as e:
        print(f"❌ AWS SES Error: {e}")
        
    return False

if __name__ == "__main__":
    print("🏥 Healthcare Platform Email Diagnostic")
    print("="*60)
    
    # Test current configuration
    smtp_works = test_email_credentials()
    
    if not smtp_works:
        # Test AWS SES alternative
        aws_works = test_aws_ses()
        
        if not aws_works:
            suggest_alternatives()
            
    print("\n" + "="*60)
    print("📧 Email diagnostic complete!")
    
    if not smtp_works:
        print("⚠️  Email notifications are currently not working.")
        print("Please fix email configuration to enable admin account notifications.")
    else:
        print("✅ Email system is ready for admin account notifications!")
