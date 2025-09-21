"""
Simple email test to bypass notification system issues
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.append('/d/alfiya/backend')

django.setup()

import boto3
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_test_email():
    """Test direct AWS SES email sending"""
    
    print("📧 Testing Direct AWS SES Email Sending")
    print("=" * 50)
    
    try:
        # Initialize SES client
        ses_client = boto3.client(
            'ses',
            aws_access_key_id=getattr(settings, 'AWS_ACCESS_KEY_ID', None),
            aws_secret_access_key=getattr(settings, 'AWS_SECRET_ACCESS_KEY', None),
            region_name=getattr(settings, 'AWS_SES_REGION', 'us-east-1')
        )
        
        print("✅ SES client initialized successfully")
        
        # Test email data
        from_email = getattr(settings, 'AWS_SES_FROM_EMAIL', 'info@xerxez.in')
        to_email = 'tanzeem.agra@rugrel.com'
        
        print(f"📤 From: {from_email}")
        print(f"📥 To: {to_email}")
        
        # Create simple email content
        subject = "🏥 Test Registration Notification"
        context = {
            'user_name': 'Test User',
            'user_email': 'test@example.com',
            'registration_time': '2025-09-04 16:00:00',
            'admin_portal_url': 'http://localhost:5173/admin',
            'system_name': 'Healthcare Management System'
        }
        
        # Simple HTML template
        html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>🏥 New Doctor Registration</h2>
            <p>A new healthcare professional has registered on the platform:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Registration Details:</h3>
                <ul>
                    <li><strong>Name:</strong> {context['user_name']}</li>
                    <li><strong>Email:</strong> {context['user_email']}</li>
                    <li><strong>Registration Time:</strong> {context['registration_time']}</li>
                </ul>
            </div>
            
            <p>Please review and approve this registration in the admin portal:</p>
            <a href="{context['admin_portal_url']}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
                Review Registration
            </a>
            
            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
                This is an automated notification from {context['system_name']}.
            </p>
        </div>
        """
        
        text_content = strip_tags(html_content)
        
        # Send email using SES
        response = ses_client.send_email(
            Source=from_email,
            Destination={'ToAddresses': [to_email]},
            Message={
                'Subject': {'Data': subject, 'Charset': 'UTF-8'},
                'Body': {
                    'Text': {'Data': text_content, 'Charset': 'UTF-8'},
                    'Html': {'Data': html_content, 'Charset': 'UTF-8'}
                }
            }
        )
        
        print(f"✅ Email sent successfully!")
        print(f"📧 Message ID: {response['MessageId']}")
        return True
        
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        return False

if __name__ == '__main__':
    send_test_email()
