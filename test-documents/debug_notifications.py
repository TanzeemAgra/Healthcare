#!/usr/bin/env python
"""
Debug Notification Manager Import
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def debug_notification_system():
    """Debug the notification system imports"""
    print("🔍 Debugging Notification System")
    print("="*50)
    
    try:
        # Import the notification system module
        from hospital import notification_system
        print("✅ Imported notification_system module")
        
        # Check what's available in the module
        print(f"📋 Available attributes: {dir(notification_system)}")
        
        # Check if HealthcareNotificationManager exists
        if hasattr(notification_system, 'HealthcareNotificationManager'):
            print("✅ HealthcareNotificationManager class found")
            
            # Try to create an instance
            manager = notification_system.HealthcareNotificationManager()
            print("✅ HealthcareNotificationManager instance created")
            
            # Check if it has the method we need
            if hasattr(manager, 'send_admin_account_created_notification'):
                print("✅ send_admin_account_created_notification method found")
                return manager
            else:
                print("❌ send_admin_account_created_notification method NOT found")
                print(f"Available methods: {[m for m in dir(manager) if not m.startswith('_')]}")
        else:
            print("❌ HealthcareNotificationManager class NOT found")
            
        # Check if notification_manager global exists
        if hasattr(notification_system, 'notification_manager'):
            print("✅ notification_manager global variable found")
            manager = notification_system.notification_manager
            print(f"Manager type: {type(manager)}")
            
            if manager and hasattr(manager, 'send_admin_account_created_notification'):
                print("✅ Global notification_manager has required method")
                return manager
            else:
                print("❌ Global notification_manager missing required method or is None")
        else:
            print("❌ notification_manager global variable NOT found")
            
    except Exception as e:
        print(f"❌ Import error: {e}")
        
    return None

if __name__ == "__main__":
    manager = debug_notification_system()
    
    if manager:
        print("\n🎉 Notification system is working!")
    else:
        print("\n❌ Notification system needs fixing")
        print("\n🔧 Checking notification_system.py file...")
        
        # Read and check the file
        try:
            with open('hospital/notification_system.py', 'r') as f:
                content = f.read()
                
            if 'def send_admin_account_created_notification' in content:
                print("✅ Method definition found in file")
            else:
                print("❌ Method definition NOT found in file")
                
            if 'notification_manager = HealthcareNotificationManager()' in content:
                print("✅ Global variable assignment found in file")
            else:
                print("❌ Global variable assignment NOT found in file")
                
        except Exception as e:
            print(f"❌ Error reading file: {e}")
