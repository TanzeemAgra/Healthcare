import urllib.request
import urllib.parse
import json

def test_endpoint():
    """Test the password reset endpoint with basic urllib"""
    
    url = "http://127.0.0.1:8000/api/auth/password-reset/initiate/"
    
    # Test data
    data = {
        "email": "test@example.com",
        "recaptcha_token": "test_token_123"
    }
    
    # Convert to JSON and encode
    json_data = json.dumps(data).encode('utf-8')
    
    # Create request
    req = urllib.request.Request(
        url,
        data=json_data,
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'Python-Test/1.0'
        },
        method='POST'
    )
    
    try:
        print("🚀 Sending request to:", url)
        print("📤 Request data:", data)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            print("📡 Status:", response.status)
            print("📋 Headers:", dict(response.headers))
            
            response_data = response.read().decode('utf-8')
            print("📝 Response:", response_data)
            
            try:
                parsed_data = json.loads(response_data)
                print("✅ JSON Response:", json.dumps(parsed_data, indent=2))
            except json.JSONDecodeError:
                print("❌ Response is not valid JSON")
                
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error {e.code}: {e.reason}")
        try:
            error_response = e.read().decode('utf-8')
            print("📝 Error response:", error_response)
        except:
            print("❌ Could not read error response")
            
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_endpoint()
