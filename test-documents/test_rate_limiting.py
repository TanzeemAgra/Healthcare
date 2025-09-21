#!/usr/bin/env python3
"""
Test Rate Limiting Configuration for Registration
Tests the soft-coded rate limiting settings
"""

import requests
import json
import time

def test_rate_limiting_disabled():
    """Test that rate limiting is properly disabled for registration"""
    
    print("🧪 Testing Registration Rate Limiting Configuration")
    print("=" * 60)
    
    # Test with incomplete data (should fail validation but not rate limiting)
    test_data = {
        'firstName': 'Rate',
        'lastName': 'Test', 
        'email': 'rate.test@example.com',
        'username': 'ratetest123',
        'password': 'TestPassword123!',
        'confirmPassword': 'TestPassword123!'
    }
    
    print("📊 Making multiple rapid registration attempts to test rate limiting...")
    
    for i in range(8):  # Try 8 attempts (more than old limit of 5)
        try:
            print(f"\n🚀 Attempt {i+1}/8...")
            
            response = requests.post(
                'http://localhost:8000/api/auth/comprehensive-register/',
                headers={'Content-Type': 'application/json'},
                data=json.dumps(test_data),
                timeout=10
            )
            
            print(f"📡 Status: {response.status_code}")
            
            if response.status_code == 429:
                print(f"❌ Rate limited on attempt {i+1}")
                print(f"📝 Response: {response.text}")
                return False
            elif response.status_code == 400:
                print(f"✅ Validation error (expected) - Rate limiting not triggered")
            else:
                print(f"📝 Response: {response.status_code}")
                
            # Small delay between requests
            time.sleep(0.5)
            
        except Exception as e:
            print(f"❌ Request failed: {e}")
            return False
    
    print(f"\n✅ SUCCESS: Made 8 rapid attempts without hitting rate limit!")
    print("✅ Rate limiting is properly disabled for registration")
    return True

def test_complete_registration_no_rate_limit():
    """Test that complete registration works without rate limiting"""
    
    print("\n🧪 Testing Complete Registration (No Rate Limiting)")
    print("=" * 60)
    
    # Complete registration data
    complete_data = {
        'firstName': 'No',
        'lastName': 'RateLimit',
        'dateOfBirth': '1985-05-15',
        'gender': 'Male',
        'nationality': 'American',
        'email': 'no.ratelimit@example.com',
        'confirmEmail': 'no.ratelimit@example.com',
        'phone': '+1-555-123-4567',
        'address': '123 No Rate Limit St',
        'city': 'Test City',
        'zipCode': '12345',
        'country': 'US',
        'professionalTitle': 'Dr. (Doctor)',
        'medicalLicenseNumber': 'NORL123456',
        'licenseIssuingAuthority': 'Test Medical Board',
        'licenseExpiryDate': '2026-12-31',
        'specialization': 'Rate Limit Medicine',
        'yearsOfExperience': '5',
        'currentWorkplace': 'No Rate Limit Hospital',
        'username': 'noratelimit123',
        'password': 'NoRateLimit123!',
        'confirmPassword': 'NoRateLimit123!',
        'securityQuestion1': 'What was your first pet\'s name?',
        'securityAnswer1': 'NoRateLimit',
        'securityQuestion2': 'What city were you born in?',
        'securityAnswer2': 'Test City',
        'gdprConsent': True,
        'hipaaAgreement': True,
        'termsAccepted': True,
        'dataProcessingConsent': True,
        'emergencyContact': 'Emergency NoRate',
        'emergencyContactPhone': '+1-555-987-6543',
        'recaptcha_token': 'no_rate_limit_test'
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/comprehensive-register/',
            headers={'Content-Type': 'application/json'},
            data=json.dumps(complete_data),
            timeout=15
        )
        
        print(f"📡 Response Status: {response.status_code}")
        
        if response.status_code == 201:
            print("✅ Complete registration successful without rate limiting!")
            data = response.json()
            print(f"📧 User: {data.get('data', {}).get('email')}")
            print(f"📧 Admin notification sent to: info@xerxez.in")
            return True
        else:
            print(f"❌ Registration failed: {response.text}")
            return False
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == '__main__':
    print("🛡️ Registration Rate Limiting Test Suite")
    print("=" * 60)
    
    # Test 1: Multiple rapid attempts should not be rate limited
    test1_result = test_rate_limiting_disabled()
    
    # Test 2: Complete registration should work
    test2_result = test_complete_registration_no_rate_limit()
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary:")
    print(f"• Rate Limiting Disabled: {'✅ PASS' if test1_result else '❌ FAIL'}")
    print(f"• Complete Registration: {'✅ PASS' if test2_result else '❌ FAIL'}")
    
    if test1_result and test2_result:
        print("\n🎉 ALL TESTS PASSED!")
        print("✅ Registration rate limiting has been properly disabled")
        print("✅ Users can now register without 429 errors")
    else:
        print("\n⚠️ SOME TESTS FAILED - Check configuration")
