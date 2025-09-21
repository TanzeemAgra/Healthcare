#!/usr/bin/env python3
"""
Debug password reset email sending
"""
import requests
import json
import sys
import os

def test_password_reset_with_debug():
    """Test password reset with detailed debugging"""
    
    print("=== PASSWORD RESET EMAIL DEBUG ===")
    
    # Test with a specific email
    test_email = "test@example.com"
    url = "http://127.0.0.1:8000/api/auth/password-reset/initiate/"
    
    print(f"🧪 Testing password reset for: {test_email}")
    print(f"🔗 API endpoint: {url}")
    print("-" * 60)
    
    # Test data
    data = {
        "email": test_email,
        "recaptcha_token": "debug_test_token"
    }
    
    try:
        # Make the request
        response = requests.post(
            url,
            json=data,
            headers={
                'Content-Type': 'application/json',
                'User-Agent': 'EmailDebugTest/1.0'
            },
            timeout=30
        )
        
        print(f"📡 HTTP Status: {response.status_code}")
        print(f"📝 Response Headers: {dict(response.headers)}")
        
        try:
            response_data = response.json()
            print(f"📄 Response Body:")
            print(json.dumps(response_data, indent=2))
            
            if response_data.get('success'):
                print("\n✅ SUCCESS! API returned success response")
                print("📧 Check the Django server logs for email sending details")
                print("🔍 Look for:")
                print("   • 'Password reset email sent successfully'")
                print("   • 'AWS SES error'")
                print("   • 'Failed to send password reset email'")
            else:
                print(f"\n❌ FAILED: {response_data.get('error', 'Unknown error')}")
                
        except json.JSONDecodeError:
            print(f"📄 Raw Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Is the Django server running on http://127.0.0.1:8000?")
        print("💡 Start the server with: cd backend && python manage.py runserver")
        
    except requests.exceptions.Timeout:
        print("❌ Timeout Error: The request took too long")
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    # Install requests if needed
    try:
        import requests
    except ImportError:
        print("Installing requests...")
        os.system("pip install requests")
        import requests
    
    test_password_reset_with_debug()
