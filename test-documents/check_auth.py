"""
Quick Authentication Status Checker
Run this to verify if you're logged in as super admin
"""

import requests
import json

def check_auth_status():
    try:
        # Check authentication status
        response = requests.get('http://localhost:8000/api/hospital/management/debug/auth/')
        auth_data = response.json()
        
        print("🔍 Authentication Status Check")
        print("=" * 50)
        print(f"✅ Response Status: {response.status_code}")
        print(f"🔐 Is Authenticated: {auth_data['user']['is_authenticated']}")
        print(f"👤 Username: {auth_data['user']['username']}")
        print(f"📧 Email: {auth_data['user']['email']}")
        print(f"⭐ Is Super User: {auth_data['user']['is_superuser']}")
        print(f"🛡️ Is Staff: {auth_data['user']['is_staff']}")
        print(f"👥 Groups: {auth_data['user']['groups']}")
        
        if not auth_data['user']['is_authenticated']:
            print("\n❌ NOT LOGGED IN")
            print("🔧 Solution: Go to http://localhost:5173/login and login with super admin credentials")
        elif not auth_data['user']['is_superuser']:
            print("\n⚠️ NOT SUPER ADMIN")
            print("🔧 Solution: Login with super admin account instead")
        else:
            print("\n✅ READY TO CREATE USERS")
            print("🎉 You can now create admin users at http://localhost:5173/admin/user-management")
            
    except Exception as e:
        print(f"❌ Error checking authentication: {e}")
        print("🔧 Make sure backend server is running at http://localhost:8000")

if __name__ == "__main__":
    check_auth_status()
