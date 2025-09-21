import requests
import json

# Test the password reset API endpoint
def test_password_reset():
    url = "http://localhost:8000/api/auth/password-reset/initiate/"
    
    # Test data
    data = {
        "email": "test@example.com",
        "recaptcha_token": "test_token"
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, json=data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_password_reset()
