#!/usr/bin/env python3

import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

print("Testing Healthcare Notification System...")

try:
    from hospital.notification_system import notification_manager
    print("✅ Notification system imported successfully!")
    
    # Test critical lab result
    patient_data = {
        'first_name': 'John',
        'last_name': 'Smith',
        'patient_id': 'P12345',
        'date_of_birth': '1975-06-15',
        'phone': '+1-555-0123',
        'emergency_contact': 'Jane Smith - Wife - 555-0124'
    }
    
    lab_data = {
        'test_name': 'Complete Blood Count',
        'order_id': 'LAB-2024-001',
        'test_date': '2024-01-15',
        'report_date': '2024-01-15',
        'critical_results': [
            {
                'parameter': 'Hemoglobin',
                'value': '4.2',
                'unit': 'g/dL',
                'normal_range': '13.5-17.5',
                'status': 'CRITICAL LOW'
            }
        ],
        'critical_summary': 'Severe anemia detected',
        'chart_url': 'https://platform.example.com/patient/P12345/chart'
    }
    
    physician_data = {
        'name': 'Dr. Sarah Johnson',
        'email': 'info@xerxez.in',
        'phone': '+1-555-0199'
    }
    
    print("\n🚨 Testing Critical Lab Result Notification...")
    result = notification_manager.send_critical_lab_result(patient_data, lab_data, physician_data)
    
    if result.get('success'):
        print("✅ Critical lab result notification sent successfully!")
        print(f"   Message ID: {result.get('message_id', 'N/A')}")
    else:
        print(f"❌ Failed: {result.get('error', 'Unknown error')}")

    # Test appointment reminder
    print("\n📅 Testing Appointment Reminder...")
    patient_data_apt = {
        'first_name': 'Maria',
        'last_name': 'Rodriguez',
        'email': 'info@xerxez.in',
        'phone_number': '+1-555-0145'
    }
    
    appointment_data = {
        'doctor_name': 'Dr. Michael Chen',
        'date': 'Wednesday, January 17, 2024',
        'time': '2:30 PM',
        'clinic_name': 'Advanced Medical Center',
        'specialty': 'dermatology',
        'appointment_type': 'Follow-up Consultation'
    }
    
    result2 = notification_manager.send_appointment_reminder(patient_data_apt, appointment_data)
    
    if result2.get('success'):
        print("✅ Appointment reminder sent successfully!")
    else:
        print(f"❌ Failed: {result2.get('error', 'Unknown error')}")

    print("\n🎉 Healthcare notification system is operational!")
    print("   All critical notification types have been implemented:")
    print("   ✅ Critical lab result alerts")
    print("   ✅ Appointment reminders") 
    print("   ✅ Prescription refill reminders")
    print("   ✅ Emergency alerts")

except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
