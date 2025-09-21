#!/usr/bin/env python3
"""
Test password reset with existing user creation
"""
import urllib.request
import urllib.parse
import json

def test_password_reset_with_real_scenario():
    """Test password reset with step-by-step debugging"""
    
    print("=== PASSWORD RESET EMAIL DEBUG TEST ===")
    
    # Test with different email scenarios
    test_emails = [
        "admin@example.com",     # Might exist as admin
        "test@xerxez.in",        # Domain email
        "info@xerxez.in",        # The from email
        "test@example.com",      # Generic test email
        "user@test.com"          # Another test email
    ]
    
    url = "http://127.0.0.1:8000/api/auth/password-reset/initiate/"
    
    for email in test_emails:
        print(f"\n🧪 Testing with email: {email}")
        print("-" * 50)
        
        # Test data
        data = {
            "email": email,
            "recaptcha_token": "debug_test_token"
        }
        
        # Convert to JSON and encode
        json_data = json.dumps(data).encode('utf-8')
        
        # Create request
        req = urllib.request.Request(
            url,
            data=json_data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'EmailDebugTest/1.0'
            },
            method='POST'
        )
        
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                response_data = response.read().decode('utf-8')
                parsed_data = json.loads(response_data)
                
                print(f"📡 Status: {response.status}")
                print(f"📝 Response: {json.dumps(parsed_data, indent=2)}")
                
                if parsed_data.get('success'):
                    print(f"✅ Success! Check backend logs for email sending details.")
                else:
                    print(f"❌ Failed: {parsed_data.get('error', 'Unknown error')}")
                    
        except urllib.error.HTTPError as e:
            print(f"❌ HTTP Error {e.code}: {e.reason}")
            try:
                error_response = e.read().decode('utf-8')
                print(f"📝 Error response: {error_response}")
            except:
                print("❌ Could not read error response")
                
        except Exception as e:
            print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_password_reset_with_real_scenario()
