#!/usr/bin/env python3
"""
Test Frontend Registration Form Behavior
Simulates what happens when users submit incomplete or complete forms
"""

import requests
import json

def test_incomplete_registration():
    """Test what happens with incomplete registration data (like frontend was sending)"""
    
    print("🧪 Testing Incomplete Registration (mimicking frontend issue)")
    print("=" * 60)
    
    # This is what the frontend was sending before (incomplete data)
    incomplete_data = {
        'firstName': 'Test',
        'lastName': 'User', 
        'email': 'test.frontend@example.com',
        'username': 'testfrontend123',
        'password': 'TestPassword123!',
        'confirmPassword': 'TestPassword123!'
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/comprehensive-register/',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(incomplete_data)
        )
        
        print(f"📡 Response Status: {response.status_code}")
        print(f"📝 Response: {response.text}")
        
        if response.status_code == 400:
            print("\n❌ As expected, incomplete registration fails validation")
            data = response.json()
            if 'validation_errors' in data:
                print("Missing required fields:")
                for field, error in data['validation_errors'].items():
                    print(f"   • {field}: {error}")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

def test_complete_registration():
    """Test with complete registration data"""
    
    print("\n🧪 Testing Complete Registration (all required fields)")
    print("=" * 60)
    
    # Complete data matching all validation requirements
    complete_data = {
        # Step 1: Personal Information
        'firstName': 'Dr. Frontend',
        'lastName': 'Test',
        'dateOfBirth': '1985-05-15',
        'gender': 'Male',
        'nationality': 'American',
        
        # Step 2: Contact Information  
        'email': 'frontend.test@example.com',
        'confirmEmail': 'frontend.test@example.com',
        'phone': '+1-555-123-4567',
        'address': '123 Frontend Drive',
        'city': 'Test City',
        'zipCode': '12345',
        'country': 'US',
        
        # Step 3: Professional Information
        'professionalTitle': 'Dr. (Doctor)',
        'medicalLicenseNumber': 'FRONTEND123',
        'licenseIssuingAuthority': 'Test Medical Board',
        'licenseExpiryDate': '2026-12-31',
        'specialization': 'Frontend Medicine',
        'yearsOfExperience': '5',
        'currentWorkplace': 'Frontend General Hospital',
        
        # Step 4: Account Security
        'username': 'frontendtest123',
        'password': 'FrontendTest123!',
        'confirmPassword': 'FrontendTest123!',
        'securityQuestion1': 'What was your first pet\'s name?',
        'securityAnswer1': 'Frontend',
        'securityQuestion2': 'What city were you born in?',
        'securityAnswer2': 'Test City',
        
        # Step 5: Legal Agreements
        'gdprConsent': True,
        'hipaaAgreement': True,
        'termsAccepted': True,
        'dataProcessingConsent': True,
        'emergencyContact': 'Frontend Emergency',
        'emergencyContactPhone': '+1-555-987-6543',
        'recaptcha_token': 'frontend_test_bypass'
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/comprehensive-register/',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(complete_data)
        )
        
        print(f"📡 Response Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Complete registration successful!")
            data = response.json()
            print(f"📧 User: {data.get('data', {}).get('email')}")
            print(f"📧 Name: {data.get('data', {}).get('name')}")
            print(f"📧 Status: {data.get('data', {}).get('status')}")
            print("\n📧 Check your email at info@xerxez.in for admin notification!")
            
        else:
            print(f"❌ Registration failed: {response.text}")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == '__main__':
    print("🌐 Frontend Registration Form Testing")
    print("=" * 60)
    
    test_incomplete_registration()
    test_complete_registration()
    
    print("\n" + "=" * 60)
    print("📝 Summary:")
    print("• Incomplete forms fail validation (as expected)")
    print("• Complete forms should succeed and send emails")
    print("• Users must complete ALL 5 steps for successful registration")
    print("• Check info@xerxez.in for admin notifications!")
