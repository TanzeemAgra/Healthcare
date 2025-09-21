# Test Enhanced Notification Service
# Simple test script to verify the notification system works

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('d:/alfiya/backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospital.enhanced_notification_service import get_notification_service
from hospital.notification_models import NotificationTemplate


def test_notification_service():
    """Test the enhanced notification service"""
    print("🧪 Testing Enhanced Notification Service")
    print("=" * 50)
    
    # Initialize service
    service = get_notification_service()
    print(f"✅ Service initialized successfully")
    print(f"📧 Email provider: {service.email_provider.__class__.__name__}")
    print(f"📱 SMS provider: {service.sms_provider.__class__.__name__ if service.sms_provider else 'Not configured'}")
    
    # Check templates
    print("\n📋 Available Templates:")
    templates = NotificationTemplate.objects.filter(is_active=True)
    for template in templates:
        print(f"  - {template.template_type}: {template.subject_template}")
    
    # Test template rendering
    print("\n🎨 Testing Template Rendering:")
    test_template = templates.first()
    if test_template:
        context_data = {
            'patient_name': 'John Doe',
            'appointment_date': '2024-01-15',
            'appointment_time': '10:00 AM',
            'doctor_name': 'Dr. Smith',
            'clinic_name': 'Health Care Clinic',
            'clinic_address': '123 Medical Street'
        }
        
        subject = service.render_template(test_template.subject_template, context_data)
        body = service.render_template(test_template.email_template, context_data)
        
        print(f"  📝 Template: {test_template.template_type}")
        print(f"  📧 Subject: {subject}")
        print(f"  📄 Body preview: {body[:100]}...")
    
    # Test quiet hours check
    print(f"\n🕐 Quiet hours check: {'Yes' if service.check_quiet_hours() else 'No'}")
    
    print("\n✅ All tests completed successfully!")
    print("\n📚 Next steps:")
    print("1. Configure TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER for SMS")
    print("2. Configure SENDGRID_API_KEY, SENDGRID_FROM_EMAIL for enhanced emails")
    print("3. Test API endpoints with actual email/phone numbers")
    print("4. Set up Celery for background processing (optional)")


def test_api_endpoints():
    """Test available API endpoints"""
    print("\n🌐 Available API Endpoints:")
    print("=" * 50)
    
    endpoints = [
        {
            'url': '/api/hospital/notifications/enhanced/send/',
            'method': 'POST',
            'description': 'Send immediate notification',
            'example': {
                'notification_type': 'appointment_reminder',
                'recipient_email': 'patient@example.com',
                'context_data': {
                    'patient_name': 'John Doe',
                    'appointment_date': '2024-01-15',
                    'appointment_time': '10:00 AM',
                    'doctor_name': 'Dr. Smith',
                    'clinic_name': 'Health Care Clinic'
                }
            }
        },
        {
            'url': '/api/hospital/notifications/appointment-reminder/',
            'method': 'POST',
            'description': 'Send appointment reminder',
            'example': {
                'patient_email': 'patient@example.com',
                'patient_phone': '+1234567890',
                'patient_name': 'John Doe',
                'appointment_date': '2024-01-15',
                'appointment_time': '10:00 AM',
                'doctor_name': 'Dr. Smith',
                'clinic_name': 'Health Care Clinic'
            }
        },
        {
            'url': '/api/hospital/notifications/test-results/',
            'method': 'POST',
            'description': 'Send test results notification',
            'example': {
                'patient_email': 'patient@example.com',
                'patient_name': 'John Doe',
                'test_name': 'Blood Test',
                'clinic_name': 'Health Care Clinic'
            }
        },
        {
            'url': '/api/hospital/notifications/emergency-alert/',
            'method': 'POST',
            'description': 'Send emergency alert',
            'example': {
                'recipient_email': 'admin@example.com',
                'recipient_phone': '+1234567890',
                'emergency_message': 'System maintenance required'
            }
        },
        {
            'url': '/api/hospital/notifications/bulk/',
            'method': 'POST',
            'description': 'Send bulk notifications',
            'example': {
                'notification_type': 'appointment_reminder',
                'recipients': [
                    {
                        'email': 'patient1@example.com',
                        'context': {'patient_name': 'John Doe'}
                    },
                    {
                        'email': 'patient2@example.com',
                        'context': {'patient_name': 'Jane Smith'}
                    }
                ]
            }
        }
    ]
    
    for endpoint in endpoints:
        print(f"\n📍 {endpoint['method']} {endpoint['url']}")
        print(f"   {endpoint['description']}")
        print(f"   Example payload: {endpoint['example']}")


if __name__ == '__main__':
    try:
        test_notification_service()
        test_api_endpoints()
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
