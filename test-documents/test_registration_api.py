#!/usr/bin/env python3
"""
Direct API test for registration with email functionality
"""

import requests
import json

def test_registration_api():
    """Test the registration API endpoint directly"""
    
    # Registration API endpoint
    url = "http://127.0.0.1:8000/api/hospital/comprehensive-register/"
    
    # Test registration data
    registration_data = {
        "firstName": "Dr. Ahmed",
        "lastName": "Khan", 
        "dateOfBirth": "1985-05-15",
        "gender": "Male",
        "nationality": "Indian",
        "email": "tanzeem.agra@rugrel.com",
        "confirmEmail": "tanzeem.agra@rugrel.com",
        "phone": "+91-9876543210",
        "address": "123 Medical Plaza",
        "city": "Mumbai",
        "zipCode": "400001",
        "country": "India",
        "professionalTitle": "Cardiologist",
        "medicalLicenseNumber": "MD12345",
        "licenseIssuingAuthority": "Indian Medical Council",
        "licenseExpiryDate": "2026-12-31",
        "specialization": "Cardiology",
        "yearsOfExperience": "8",
        "currentWorkplace": "Delhi Heart Institute",
        "username": "drakhan123",
        "password": "SecurePass123!",
        "confirmPassword": "SecurePass123!",
        "securityQuestion1": "What is your mother's maiden name?",
        "securityAnswer1": "Smith",
        "securityQuestion2": "What was your first pet's name?",
        "securityAnswer2": "Buddy",
        "emergencyContact": "Dr. Sarah Khan",
        "emergencyContactPhone": "+91-9876543211",
        "agreeToTerms": True,
        "agreeToPrivacy": True,
        "gdprConsent": True,
        "hipaaAgreement": True,
        "termsAccepted": True,
        "dataProcessingConsent": True,
        "recaptcha_token": "test-token-skip-verification"
    }
    
    print("🚀 Testing Registration API with Enhanced Email System")
    print("=" * 60)
    print(f"📤 Sending registration request to: {url}")
    print(f"👤 User: {registration_data['firstName']} {registration_data['lastName']}")
    print(f"📧 Email: {registration_data['email']}")
    
    try:
        # Send POST request to registration API
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        response = requests.post(
            url, 
            data=json.dumps(registration_data),
            headers=headers,
            timeout=30
        )
        
        print(f"\n📊 Response Status: {response.status_code}")
        
        if response.status_code == 201:
            result = response.json()
            print("✅ Registration successful!")
            print(f"   📨 User ID: {result.get('user_id', 'N/A')}")
            print(f"   📧 Email Status: {result.get('email_sent', 'Unknown')}")
            print(f"   💬 Message: {result.get('message', 'N/A')}")
            
            print("\n🎉 EXPECTED EMAIL RESULTS:")
            print("   📮 Registration confirmation sent to: tanzeem.agra@rugrel.com")
            print("   👨‍💼 Admin approval notification sent to super admins")
            print("   📧 Both emails should use enhanced templates with professional styling")
            
        elif response.status_code == 400:
            errors = response.json()
            print("❌ Registration failed - Validation errors:")
            for field, error in errors.items():
                print(f"   • {field}: {error}")
                
        else:
            print(f"❌ Unexpected response: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure Django server is running on http://127.0.0.1:8000")
    except requests.exceptions.Timeout:
        print("❌ Timeout Error: Request took too long")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

    print("\n" + "=" * 60)
    print("🏁 Registration API Test Complete!")

if __name__ == "__main__":
    test_registration_api()
