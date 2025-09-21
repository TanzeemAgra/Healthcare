#!/usr/bin/env python
import requests
import json

def test_contact_form():
    """Test the contact form submission with AWS SES integration"""
    
    # Contact form test data
    test_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'phone': '+1-555-0123',
        'department': 'General Inquiry',
        'country': 'USA',
        'contactMethod': 'Email',
        'subject': 'Test Contact Form Submission',
        'message': 'This is a test message to verify AWS SES integration is working properly.',
        'newsletter': True
    }
    
    # API endpoint
    url = 'http://localhost:8000/api/hospital/contact/submit/'
    
    print('🧪 Testing Contact Form with AWS SES Integration')
    print('=' * 55)
    print(f'📤 Submitting to: {url}')
    print(f'📋 Test Data:')
    for key, value in test_data.items():
        print(f'   {key}: {value}')
    print()
    
    try:
        # Submit the form
        response = requests.post(url, data=test_data, timeout=30)
        
        print(f'📊 Response Status: {response.status_code}')
        print(f'📄 Response Headers: {dict(response.headers)}')
        print()
        
        if response.status_code == 200:
            result = response.json()
            print('✅ SUCCESS! Contact form submitted successfully')
            print(f'📧 Message: {result.get("message", "No message")}')
            print(f'🔔 Admin notification sent: {result.get("admin_notification_sent", False)}')
            print(f'✉️ User confirmation sent: {result.get("user_confirmation_sent", False)}')
            print()
            print('🎯 AWS SES Integration Status:')
            if result.get('admin_notification_sent') and result.get('user_confirmation_sent'):
                print('   ✅ AWS SES is working correctly!')
                print('   ✅ Both admin and user emails were sent')
            elif result.get('admin_notification_sent') or result.get('user_confirmation_sent'):
                print('   ⚠️ Partial success - some emails were sent')
            else:
                print('   ❌ Email sending may have failed')
            
        else:
            print('❌ FAILED! Contact form submission failed')
            try:
                error_data = response.json()
                print(f'Error: {error_data}')
            except:
                print(f'Error response: {response.text}')
                
    except requests.exceptions.RequestException as e:
        print(f'❌ Connection Error: {e}')
        print('💡 Make sure the Django backend is running on port 8000')
    except Exception as e:
        print(f'❌ Unexpected Error: {e}')

if __name__ == '__main__':
    test_contact_form()
