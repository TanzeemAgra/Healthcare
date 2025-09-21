#!/usr/bin/env python3
"""
Enhanced Healthcare Notification System Test
Tests critical patient safety notifications, appointment reminders, prescription alerts, and emergency notifications
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospital.notification_system import notification_manager

def test_critical_lab_result():
    """Test critical lab result notification"""
    print("\n🚨 Testing Critical Lab Result Notification...")
    
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
        'result_timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'critical_results': [
            {
                'parameter': 'Hemoglobin',
                'value': '4.2',
                'unit': 'g/dL',
                'normal_range': '13.5-17.5',
                'status': 'CRITICAL LOW'
            },
            {
                'parameter': 'White Blood Cell Count',
                'value': '25000',
                'unit': '/μL',
                'normal_range': '4000-11000',
                'status': 'CRITICAL HIGH'
            }
        ],
        'critical_summary': 'Severe anemia and leukocytosis detected',
        'chart_url': 'https://platform.example.com/patient/P12345/chart'
    }
    
    physician_data = {
        'name': 'Dr. Sarah Johnson',
        'email': 'info@xerxez.in',  # Using verified email
        'phone': '+1-555-0199'
    }
    
    result = notification_manager.send_critical_lab_result(patient_data, lab_data, physician_data)
    
    if result.get('success'):
        print("✅ Critical lab result notification sent successfully!")
        print(f"   Message ID: {result.get('message_id', 'N/A')}")
    else:
        print(f"❌ Failed to send critical lab result notification: {result.get('error', 'Unknown error')}")
    
    return result

def test_appointment_reminder():
    """Test enhanced appointment reminder"""
    print("\n📅 Testing Enhanced Appointment Reminder...")
    
    patient_data = {
        'first_name': 'Maria',
        'last_name': 'Rodriguez',
        'email': 'info@xerxez.in',  # Using verified email
        'phone_number': '+1-555-0145'
    }
    
    appointment_data = {
        'doctor_name': 'Dr. Michael Chen',
        'date': 'Wednesday, January 17, 2024',
        'time': '2:30 PM',
        'clinic_name': 'Advanced Medical Center',
        'clinic_address': '123 Healthcare Blvd, Medical City, MC 12345',
        'clinic_phone': '(555) 123-4567',
        'clinic_email': 'appointments@advancedmedical.com',
        'specialty': 'dermatology',
        'specialty_display': 'Dermatology',
        'appointment_type': 'Follow-up Consultation',
        'duration': 45,
        'appointment_id': 'APT-2024-0156',
        'reminder_type': '24_hour',
        'reschedule_url': 'https://platform.example.com/appointments/reschedule/APT-2024-0156',
        'cancel_url': 'https://platform.example.com/appointments/cancel/APT-2024-0156',
        'patient_portal_url': 'https://platform.example.com/patient/portal'
    }
    
    result = notification_manager.send_appointment_reminder(patient_data, appointment_data)
    
    if result.get('success'):
        print("✅ Enhanced appointment reminder sent successfully!")
        print(f"   Email sent: {result.get('email', {}).get('success', False)}")
        print(f"   SMS sent: {result.get('sms', {}).get('success', False) if result.get('sms') else 'No SMS sent'}")
    else:
        print(f"❌ Failed to send appointment reminder: {result.get('error', 'Unknown error')}")
    
    return result

def test_prescription_refill_reminder():
    """Test prescription refill reminder"""
    print("\n💊 Testing Prescription Refill Reminder...")
    
    patient_data = {
        'first_name': 'Robert',
        'last_name': 'Wilson',
        'email': 'info@xerxez.in',  # Using verified email
        'phone_number': '+1-555-0167',
        'patient_id': 'P67890',
        'clinic_name': 'Wellness Pharmacy Network',
        'prescribing_doctor': 'Dr. Emily Davis',
        'clinic_phone': '(555) 987-6543',
        'pharmacy_name': 'MediCare Pharmacy',
        'pharmacy_phone': '(555) 111-2222',
        'patient_portal_url': 'https://platform.example.com/patient/portal',
        'pharmacy_url': 'https://pharmacy.example.com/refill',
        'doctor_contact_url': 'https://platform.example.com/contact/doctor'
    }
    
    medications = [
        {
            'name': 'Lisinopril 10mg',
            'prescribing_doctor': 'Dr. Emily Davis',
            'dosage': '10mg',
            'frequency': 'Once daily',
            'last_filled_date': 'December 20, 2023',
            'pills_remaining': 3,
            'days_remaining': 3,
            'refills_remaining': 2,
            'is_critical': True,
            'has_interactions': False
        },
        {
            'name': 'Metformin 500mg',
            'prescribing_doctor': 'Dr. Emily Davis',
            'dosage': '500mg',
            'frequency': 'Twice daily',
            'last_filled_date': 'December 18, 2023',
            'pills_remaining': 8,
            'days_remaining': 4,
            'refills_remaining': 1,
            'is_critical': True,
            'has_interactions': False
        }
    ]
    
    result = notification_manager.send_prescription_refill_reminder(patient_data, medications)
    
    if result.get('success'):
        print("✅ Prescription refill reminder sent successfully!")
        print(f"   Priority: {result.get('priority', 'unknown')}")
        print(f"   Medications: {result.get('medications_count', 0)}")
        print(f"   Email sent: {result.get('email', {}).get('success', False)}")
        print(f"   SMS sent: {result.get('sms', {}).get('success', False) if result.get('sms') else 'No SMS sent'}")
    else:
        print(f"❌ Failed to send prescription refill reminder: {result.get('error', 'Unknown error')}")
    
    return result

def test_emergency_alert():
    """Test emergency alert system"""
    print("\n🚨 Testing Emergency Alert System...")
    
    recipients = ['info@xerxez.in']  # Using verified email
    
    alert_data = {
        'alert_type': 'CARDIAC ARREST',
        'severity': 'CRITICAL',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'location': 'Emergency Department - Room 5',
        'response_time_minutes': 5,
        'patient_name': 'David Thompson',
        'patient_id': 'P99999',
        'patient_room': 'ED-5',
        'medical_record_number': 'MRN-887766',
        'primary_action': 'Initiate CPR protocol immediately',
        'secondary_actions': [
            'Activate Code Blue team',
            'Prepare defibrillator',
            'Ensure airway management',
            'Contact attending physician'
        ],
        'special_instructions': 'Patient has known heart condition - check medical history',
        'details': 'Patient collapsed in waiting area, unresponsive, no pulse detected',
        'hospital_emergency': '(555) 911-HELP',
        'on_call_physician': 'Dr. Alexandra Kumar - (555) 777-8888',
        'nursing_station': 'ED Nursing - (555) 333-4444',
        'emergency_coordinator': 'Nurse Manager Lisa Brown - (555) 222-3333',
        'timeline': [
            {'time': '14:30:00', 'description': 'Patient arrived for scheduled appointment'},
            {'time': '14:45:00', 'description': 'Patient complained of chest pain'},
            {'time': '14:47:00', 'description': 'Patient collapsed in waiting area'},
            {'time': '14:47:30', 'description': 'Emergency alert activated'}
        ],
        'originator': 'Nurse Station - Emergency Department',
        'clinic_name': 'Metropolitan General Hospital',
        'emergency_response_url': 'https://platform.example.com/emergency/respond/CARDIAC-001',
        'patient_chart_url': 'https://platform.example.com/patient/P99999/chart',
        'escalation_url': 'https://platform.example.com/emergency/escalate',
        'recipient_phones': ['+1-555-0199']  # Phone numbers for SMS alerts
    }
    
    result = notification_manager.send_emergency_alert(recipients, alert_data)
    
    if result.get('success'):
        print("✅ Emergency alert sent successfully!")
        print(f"   Alert ID: {result.get('alert_id', 'N/A')}")
        print(f"   Severity: {result.get('severity', 'N/A')}")
        print(f"   Recipients: {result.get('recipients_count', 0)}")
        print(f"   Response deadline: {result.get('response_deadline', 'N/A')}")
    else:
        print(f"❌ Failed to send emergency alert: {result.get('error', 'Unknown error')}")
    
    return result

def main():
    """Run comprehensive notification system tests"""
    print("🏥 Healthcare Notification System - Comprehensive Test Suite")
    print("=" * 70)
    
    test_results = {}
    
    # Test 1: Critical Lab Results (Patient Safety Priority)
    test_results['critical_lab'] = test_critical_lab_result()
    
    # Test 2: Enhanced Appointment Reminders
    test_results['appointment'] = test_appointment_reminder()
    
    # Test 3: Prescription Refill Reminders
    test_results['prescription'] = test_prescription_refill_reminder()
    
    # Test 4: Emergency Alert System
    test_results['emergency'] = test_emergency_alert()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    successful_tests = []
    failed_tests = []
    
    for test_name, result in test_results.items():
        if result and result.get('success'):
            successful_tests.append(test_name)
            print(f"✅ {test_name.replace('_', ' ').title()}: SUCCESS")
        else:
            failed_tests.append(test_name)
            print(f"❌ {test_name.replace('_', ' ').title()}: FAILED")
    
    print(f"\n📈 Results: {len(successful_tests)}/{len(test_results)} tests passed")
    
    if failed_tests:
        print(f"\n⚠️  Failed tests: {', '.join(failed_tests)}")
        print("   Check AWS SES configuration and email verification status")
    else:
        print("\n🎉 All notification types are working correctly!")
        print("   Healthcare notification system is fully operational")
    
    print("\n🔍 Next Steps:")
    print("   1. Set up automated scheduling for appointment reminders")
    print("   2. Configure prescription monitoring for automatic refill alerts")
    print("   3. Integrate with hospital emergency systems")
    print("   4. Test with actual appointment and prescription data")

if __name__ == '__main__':
    main()
