#!/usr/bin/env python3
"""
Test environment variables and reCAPTCHA verification
"""
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(r'D:\alfiya\backend')

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospital.password_reset_views import verify_recaptcha

def test_env_vars():
    print("=== ENVIRONMENT VARIABLES TEST ===")
    
    # Test environment variables
    site_key = os.getenv('RECAPTCHA_SITE_KEY')
    secret_key = os.getenv('RECAPTCHA_SECRET_KEY')
    
    print(f"RECAPTCHA_SITE_KEY: {site_key}")
    print(f"RECAPTCHA_SECRET_KEY: {secret_key}")
    
    # Expected test keys
    expected_site_key = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
    expected_secret_key = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
    
    print(f"\nExpected site key: {expected_site_key}")
    print(f"Expected secret key: {expected_secret_key}")
    
    print(f"\nSite key matches: {site_key == expected_site_key}")
    print(f"Secret key matches: {secret_key == expected_secret_key}")
    
    # Test reCAPTCHA function with test token
    print("\n=== RECAPTCHA VERIFICATION TEST ===")
    test_token = "test_token_123"
    result = verify_recaptcha(test_token)
    print(f"verify_recaptcha('test_token_123') returned: {result}")
    
    # Test with None token
    result_none = verify_recaptcha(None)
    print(f"verify_recaptcha(None) returned: {result_none}")

if __name__ == "__main__":
    test_env_vars()
