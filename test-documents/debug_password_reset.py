#!/usr/bin/env python3
"""
Debug script for password reset API endpoint
"""
import requests
import json

def test_password_reset_api():
    """Test the password reset API with detailed debugging"""
    
    # API endpoint
    url = "http://localhost:8000/api/auth/password-reset/initiate/"
    
    print("=" * 60)
    print("PASSWORD RESET API DEBUG TEST")
    print("=" * 60)
    
    # Test cases with different payloads
    test_cases = [
        {
            "name": "Valid Request",
            "data": {
                "email": "test@example.com",
                "recaptcha_token": "test_token_123"
            }
        },
        {
            "name": "Missing Email",
            "data": {
                "recaptcha_token": "test_token_123"
            }
        },
        {
            "name": "Missing reCAPTCHA",
            "data": {
                "email": "test@example.com"
            }
        },
        {
            "name": "Empty Payload",
            "data": {}
        }
    ]
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "DebugScript/1.0"
    }
    
    for test_case in test_cases:
        print(f"\n🧪 Testing: {test_case['name']}")
        print(f"📤 Request Data: {json.dumps(test_case['data'], indent=2)}")
        
        try:
            response = requests.post(
                url, 
                json=test_case['data'], 
                headers=headers,
                timeout=10
            )
            
            print(f"📈 Status Code: {response.status_code}")
            print(f"📋 Response Headers: {dict(response.headers)}")
            
            try:
                response_data = response.json()
                print(f"📝 Response Body: {json.dumps(response_data, indent=2)}")
            except json.JSONDecodeError:
                print(f"📝 Response Body (raw): {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Request Failed: {e}")
        
        print("-" * 50)

if __name__ == "__main__":
    test_password_reset_api()
