# Test AWS SNS and SES Integration
# Comprehensive test script for AWS notification services

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('d:/alfiya/backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospital.aws_notification_service import get_aws_notification_service
from hospital.notification_models import NotificationTemplate
from django.conf import settings


def test_aws_credentials():
    """Test AWS credentials configuration"""
    print("🔐 Testing AWS Credentials Configuration")
    print("=" * 50)
    
    required_settings = [
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY', 
        'AWS_REGION',
        'AWS_SES_FROM_EMAIL'
    ]
    
    missing_settings = []
    for setting in required_settings:
        if not hasattr(settings, setting) or not getattr(settings, setting):
            missing_settings.append(setting)
    
    if missing_settings:
        print(f"❌ Missing AWS settings: {', '.join(missing_settings)}")
        print("\n📝 Add these to your settings.py:")
        for setting in missing_settings:
            if 'EMAIL' in setting:
                print(f"   {setting} = 'noreply@yourhealthcare.com'")
            elif 'REGION' in setting:
                print(f"   {setting} = 'us-east-1'")
            else:
                print(f"   {setting} = 'your_{setting.lower()}_here'")
        return False
    else:
        print("✅ All required AWS settings configured")
        for setting in required_settings:
            value = getattr(settings, setting)
            masked_value = value[:8] + '...' if len(value) > 8 else value
            print(f"   {setting}: {masked_value}")
        return True


def test_aws_service_initialization():
    """Test AWS service initialization"""
    print("\n🚀 Testing AWS Service Initialization")
    print("=" * 50)
    
    try:
        service = get_aws_notification_service()
        print("✅ AWS Notification Service initialized")
        
        # Get service status
        status = service.get_service_status()
        
        print("\n📊 Service Status:")
        for service_name, service_info in status.items():
            status_icon = "✅" if service_info['available'] else "❌"
            print(f"   {status_icon} {service_name}: {service_info['provider']} ({service_info['status']})")
        
        return service
        
    except Exception as e:
        print(f"❌ Service initialization failed: {e}")
        return None


def test_ses_connection(service):
    """Test SES connection and configuration"""
    print("\n📧 Testing AWS SES Connection")
    print("=" * 50)
    
    if not service or not service.email_provider:
        print("❌ SES provider not available")
        return False
    
    try:
        # Test SES quota check
        ses_client = service.email_provider.ses_client
        quota_response = ses_client.get_send_quota()
        
        print("✅ SES Connection successful")
        print(f"   📊 Send Quota: {quota_response['Max24HourSend']:.0f} emails/24h")
        print(f"   📈 Sent Last 24h: {quota_response['SentLast24Hours']:.0f}")
        print(f"   📉 Remaining: {quota_response['Max24HourSend'] - quota_response['SentLast24Hours']:.0f}")
        
        # Check sending rate
        stats_response = ses_client.get_send_statistics()
        if stats_response['SendDataPoints']:
            latest_stats = stats_response['SendDataPoints'][-1]
            print(f"   📋 Recent bounces: {latest_stats.get('Bounces', 0)}")
            print(f"   📋 Recent complaints: {latest_stats.get('Complaints', 0)}")
        
        return True
        
    except Exception as e:
        print(f"❌ SES connection failed: {e}")
        return False


def test_sns_connection(service):
    """Test SNS connection and configuration"""
    print("\n📱 Testing AWS SNS Connection")
    print("=" * 50)
    
    if not service or not service.sms_provider:
        print("❌ SNS provider not available")
        return False
    
    try:
        # Test SNS topics listing
        sns_client = service.sms_provider.sns_client
        topics_response = sns_client.list_topics(MaxItems=5)
        
        print("✅ SNS Connection successful")
        print(f"   📊 Available topics: {len(topics_response.get('Topics', []))}")
        
        # Check SMS attributes
        try:
            sms_attrs = sns_client.get_sms_attributes()
            print(f"   💰 Monthly spend limit: ${sms_attrs['attributes'].get('MonthlySpendLimit', 'Not set')}")
            print(f"   📝 Default sender ID: {sms_attrs['attributes'].get('DefaultSenderID', 'Not set')}")
        except:
            print("   ℹ️  SMS attributes not accessible (normal for some regions)")
        
        return True
        
    except Exception as e:
        print(f"❌ SNS connection failed: {e}")
        return False


def test_template_rendering(service):
    """Test template rendering functionality"""
    print("\n🎨 Testing Template Rendering")
    print("=" * 50)
    
    if not service:
        print("❌ Service not available")
        return False
    
    # Test context data
    context_data = {
        'patient_name': 'John Doe',
        'appointment_date': '2024-01-15',
        'appointment_time': '10:00 AM',
        'doctor_name': 'Dr. Smith',
        'clinic_name': 'AWS Healthcare Clinic',
        'clinic_address': '123 Cloud Street, Seattle, WA'
    }
    
    try:
        template = NotificationTemplate.objects.filter(
            template_type='appointment_reminder',
            is_active=True
        ).first()
        
        if not template:
            print("❌ No appointment reminder template found")
            return False
        
        # Test email template rendering
        subject = service.render_template(template.subject_template, context_data)
        email_body = service.render_template(template.email_template, context_data)
        
        print("✅ Email template rendering successful")
        print(f"   📧 Subject: {subject}")
        print(f"   📄 Body preview: {email_body[:100]}...")
        
        # Test SMS template rendering
        if template.sms_template:
            sms_body = service.render_template(template.sms_template, context_data)
            print("✅ SMS template rendering successful")
            print(f"   📱 SMS preview: {sms_body[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Template rendering failed: {e}")
        return False


def show_aws_endpoints():
    """Show available AWS-specific endpoints"""
    print("\n🌐 Available AWS Notification Endpoints")
    print("=" * 50)
    
    endpoints = [
        {
            'url': '/api/hospital/notifications/aws-status/',
            'method': 'GET',
            'description': 'Check AWS service status',
            'admin_only': True
        },
        {
            'url': '/api/hospital/notifications/enhanced/send/',
            'method': 'POST',
            'description': 'Send notification via AWS (with fallback)',
            'example': {
                'notification_type': 'appointment_reminder',
                'recipient_email': 'patient@example.com',
                'recipient_phone': '+1234567890',
                'context_data': {
                    'patient_name': 'John Doe',
                    'appointment_date': '2024-01-15',
                    'appointment_time': '10:00 AM',
                    'doctor_name': 'Dr. Smith',
                    'clinic_name': 'AWS Healthcare'
                }
            }
        },
        {
            'url': '/api/hospital/notifications/appointment-reminder/',
            'method': 'POST',
            'description': 'Send appointment reminder via AWS SNS/SES',
            'example': {
                'patient_email': 'patient@example.com',
                'patient_phone': '+1234567890',
                'patient_name': 'John Doe',
                'appointment_date': '2024-01-15',
                'appointment_time': '10:00 AM',
                'doctor_name': 'Dr. Smith',
                'clinic_name': 'AWS Healthcare'
            }
        },
        {
            'url': '/api/hospital/notifications/emergency-alert/',
            'method': 'POST',
            'description': 'Send critical alert via AWS (bypasses quiet hours)',
            'example': {
                'recipient_email': 'admin@healthcare.com',
                'recipient_phone': '+1234567890',
                'emergency_message': 'System maintenance required immediately'
            }
        }
    ]
    
    for endpoint in endpoints:
        admin_badge = " [ADMIN ONLY]" if endpoint.get('admin_only') else ""
        print(f"\n📍 {endpoint['method']} {endpoint['url']}{admin_badge}")
        print(f"   {endpoint['description']}")
        if 'example' in endpoint:
            print(f"   Example: {endpoint['example']}")


def show_next_steps():
    """Show next steps for AWS integration"""
    print("\n🚀 Next Steps for AWS Integration")
    print("=" * 50)
    
    print("""
1. 🔐 Configure AWS Credentials:
   - Create IAM user with SES and SNS permissions
   - Add credentials to settings.py or environment variables
   - Set your verified SES email address

2. 📧 Set up AWS SES:
   - Verify your sending domain in SES console
   - Request production access (remove sandbox limits)
   - Configure bounce and complaint handling

3. 📱 Configure AWS SNS:
   - Set SMS spending limits in SNS console
   - Configure sender ID for your region
   - Test SMS delivery with your phone number

4. 🧪 Test the Integration:
   - Run this test script: python test_aws_notifications.py
   - Test API endpoints with real email/phone numbers
   - Monitor AWS CloudWatch for delivery metrics

5. 🏥 Production Deployment:
   - Set up proper monitoring and alerting
   - Configure HIPAA-compliant logging if required
   - Implement rate limiting and abuse prevention
   - Set up backup notification providers

6. 📊 Monitor Performance:
   - Use AWS CloudWatch for delivery metrics
   - Monitor bounce and complaint rates
   - Track notification costs and optimize usage
   - Set up billing alerts to control costs
""")


if __name__ == '__main__':
    print("🏥 AWS Healthcare Notification Service Test")
    print("=" * 50)
    
    try:
        # Test AWS credentials
        credentials_ok = test_aws_credentials()
        
        if not credentials_ok:
            print("\n⚠️  Please configure AWS credentials before proceeding")
            show_next_steps()
            sys.exit(1)
        
        # Test service initialization
        service = test_aws_service_initialization()
        
        if service:
            # Test individual services
            ses_ok = test_ses_connection(service)
            sns_ok = test_sns_connection(service)
            template_ok = test_template_rendering(service)
            
            # Show results
            print(f"\n📊 Test Results Summary:")
            print(f"   AWS SES (Email): {'✅ Ready' if ses_ok else '❌ Not configured'}")
            print(f"   AWS SNS (SMS): {'✅ Ready' if sns_ok else '❌ Not configured'}")
            print(f"   Templates: {'✅ Working' if template_ok else '❌ Issues found'}")
            
            if ses_ok or sns_ok:
                print(f"\n🎉 AWS notification service is ready to use!")
                show_aws_endpoints()
            else:
                print(f"\n⚠️  AWS services need configuration")
        
        show_next_steps()
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
