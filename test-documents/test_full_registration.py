#!/usr/bin/env python3
"""
Test Full Registration Process
Tests comprehensive registration with all required fields and email sending
"""

import os
import sys
import django
import json
from datetime import datetime, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
sys.path.append('/d/alfiya/backend')

django.setup()

from django.test import Client
from django.contrib.auth.models import User

def test_comprehensive_registration():
    """Test comprehensive registration with all required fields"""
    
    print("🧪 Testing Comprehensive Registration with Full Data")
    print("=" * 60)
    
    client = Client()
    
    # Prepare comprehensive test data
    test_data = {
        # Step 1: Personal Information
        'firstName': 'Dr. John',
        'lastName': 'Smith',
        'dateOfBirth': '1985-05-15',
        'gender': 'Male',
        'nationality': 'American',
        
        # Step 2: Contact Information  
        'email': f'test.doctor.{datetime.now().strftime("%Y%m%d%H%M%S")}@example.com',
        'confirmEmail': f'test.doctor.{datetime.now().strftime("%Y%m%d%H%M%S")}@example.com',
        'phone': '+1-555-123-4567',
        'address': '123 Medical Center Drive',
        'city': 'Healthcare City',
        'zipCode': '12345',
        'country': 'US',
        
        # Step 3: Professional Information
        'professionalTitle': 'Dr. (Doctor)',
        'medicalLicenseNumber': 'MD123456789',
        'licenseIssuingAuthority': 'State Medical Board',
        'licenseExpiryDate': '2026-12-31',
        'specialization': 'Internal Medicine',
        'yearsOfExperience': '10',
        'currentWorkplace': 'City General Hospital',
        
        # Step 4: Account Security
        'username': f'testdoctor{datetime.now().strftime("%Y%m%d%H%M%S")}',
        'password': 'SecurePassword123!',
        'confirmPassword': 'SecurePassword123!',
        'securityQuestion1': 'What was your first pet\'s name?',
        'securityAnswer1': 'Fluffy',
        'securityQuestion2': 'What city were you born in?',
        'securityAnswer2': 'New York',
        
        # Step 5: Legal Agreements
        'gdprConsent': True,
        'hipaaAgreement': True,
        'termsAccepted': True,
        'dataProcessingConsent': True,
        'emergencyContact': 'Jane Smith',
        'emergencyContactPhone': '+1-555-987-6543',
        'recaptcha_token': 'test_token_bypass'
    }
    
    print("📋 Test Data Prepared:")
    print(f"   • Email: {test_data['email']}")
    print(f"   • Username: {test_data['username']}")
    print(f"   • Professional Title: {test_data['professionalTitle']}")
    print(f"   • License Number: {test_data['medicalLicenseNumber']}")
    print()
    
    try:
        # Make the registration request
        print("🚀 Sending Registration Request...")
        response = client.post(
            '/api/auth/comprehensive-register/',
            data=json.dumps(test_data),
            content_type='application/json'
        )
        
        print(f"📡 Response Status: {response.status_code}")
        
        # Parse response
        response_data = json.loads(response.content.decode('utf-8'))
        print(f"📝 Response Data: {json.dumps(response_data, indent=2)}")
        
        if response.status_code == 201:
            print("\n✅ Registration Successful!")
            
            # Check if user was created
            try:
                user = User.objects.get(username=test_data['username'])
                print(f"👤 User Created: {user.username} ({user.email})")
                
            except User.DoesNotExist:
                print("❌ User not found in database")
                
        elif response.status_code == 400:
            print("\n❌ Registration Failed - Validation Errors:")
            if 'validation_errors' in response_data:
                for field, error in response_data['validation_errors'].items():
                    print(f"   • {field}: {error}")
            else:
                print(f"   • General Error: {response_data.get('error', 'Unknown error')}")
                
        else:
            print(f"\n❌ Unexpected Response Status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Test Failed with Exception: {e}")
        import traceback
        traceback.print_exc()

def cleanup_test_user():
    """Clean up test user if it exists"""
    try:
        # Find users with test username pattern
        test_users = User.objects.filter(username__startswith='testdoctor')
        if test_users.exists():
            print(f"\n🧹 Cleaning up {test_users.count()} test users...")
            test_users.delete()
            print("✅ Test users cleaned up")
        else:
            print("\n✅ No test users to clean up")
    except Exception as e:
        print(f"⚠️  Cleanup error: {e}")

if __name__ == '__main__':
    print("🏥 Comprehensive Registration Test Suite")
    print("=" * 60)
    
    # Cleanup any existing test users first
    cleanup_test_user()
    
    # Run the test
    test_comprehensive_registration()
    
    print("\n" + "=" * 60)
    print("Test completed!")
