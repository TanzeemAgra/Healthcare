# 📬 Enhanced SMS and Email Notification Service

A comprehensive notification system for the healthcare platform supporting both SMS and email delivery with multiple providers, template management, user preferences, and queue processing.

## 🌟 Features

- **Multi-Provider Support**: SMS via Twilio, Email via SendGrid or Django SMTP
- **Template Management**: Dynamic template system with variable substitution
- **User Preferences**: Individual notification preferences per user
- **Queue Processing**: Scheduled notifications with retry logic
- **Quiet Hours**: Respects quiet hours for non-critical notifications
- **Bulk Operations**: Send notifications to multiple recipients
- **Audit Logging**: Complete audit trail of all notification attempts
- **Healthcare-Specific**: Pre-built templates for medical use cases

## 🛠️ Installation & Setup

### 1. Dependencies
The required packages are already added to `requirements.txt`:
```
twilio
sendgrid
celery
redis
```

Install them with:
```bash
pip install -r requirements.txt
```

### 2. Database Setup
The notification system extends the existing hospital app models. No additional app registration needed.

### 3. Configuration
Add these settings to your `settings.py`:

```python
# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID = 'your_twilio_account_sid'
TWILIO_AUTH_TOKEN = 'your_twilio_auth_token'
TWILIO_FROM_NUMBER = '+1234567890'

# Email Configuration (SendGrid)
SENDGRID_API_KEY = 'your_sendgrid_api_key'
SENDGRID_FROM_EMAIL = 'noreply@yourdomain.com'

# Fallback SMTP (if SendGrid not configured)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your_email@gmail.com'
EMAIL_HOST_PASSWORD = 'your_app_password'
DEFAULT_FROM_EMAIL = 'your_email@gmail.com'
```

### 4. Setup Templates
Run the management command to create default templates:
```bash
python manage.py setup_notification_templates
```

## 📱 API Endpoints

### Send Immediate Notification
```http
POST /api/hospital/notifications/enhanced/send/
Content-Type: application/json
Authorization: Bearer <token>

{
    "notification_type": "appointment_reminder",
    "recipient_email": "patient@example.com",
    "recipient_phone": "+1234567890",
    "context_data": {
        "patient_name": "John Doe",
        "appointment_date": "2024-01-15",
        "appointment_time": "10:00 AM",
        "doctor_name": "Dr. Smith",
        "clinic_name": "Health Care Clinic"
    },
    "priority": "normal"
}
```

### Send Appointment Reminder
```http
POST /api/hospital/notifications/appointment-reminder/
Content-Type: application/json
Authorization: Bearer <token>

{
    "patient_email": "patient@example.com",
    "patient_phone": "+1234567890",
    "patient_name": "John Doe",
    "appointment_date": "2024-01-15",
    "appointment_time": "10:00 AM",
    "doctor_name": "Dr. Smith",
    "clinic_name": "Health Care Clinic",
    "clinic_address": "123 Medical Street",
    "schedule_time": "2024-01-14T18:00:00Z"
}
```

### Send Test Results Notification
```http
POST /api/hospital/notifications/test-results/
Content-Type: application/json
Authorization: Bearer <token>

{
    "patient_email": "patient@example.com",
    "patient_name": "John Doe",
    "test_name": "Blood Test Results",
    "results_url": "https://portal.clinic.com/results/123",
    "clinic_name": "Health Care Clinic"
}
```

### Send Emergency Alert
```http
POST /api/hospital/notifications/emergency-alert/
Content-Type: application/json
Authorization: Bearer <token>

{
    "recipient_email": "admin@example.com",
    "recipient_phone": "+1234567890",
    "emergency_message": "System maintenance required immediately"
}
```

### Send Bulk Notifications
```http
POST /api/hospital/notifications/bulk/
Content-Type: application/json
Authorization: Bearer <token>

{
    "notification_type": "appointment_reminder",
    "recipients": [
        {
            "email": "patient1@example.com",
            "phone": "+1234567890",
            "context": {
                "patient_name": "John Doe",
                "appointment_date": "2024-01-15"
            }
        },
        {
            "email": "patient2@example.com",
            "context": {
                "patient_name": "Jane Smith",
                "appointment_date": "2024-01-16"
            }
        }
    ],
    "context_data": {
        "clinic_name": "Health Care Clinic",
        "doctor_name": "Dr. Smith"
    }
}
```

### Get Notification History
```http
GET /api/hospital/notifications/logs/?notification_type=appointment_reminder&days=30
Authorization: Bearer <token>
```

### Update User Preferences
```http
PUT /api/hospital/notifications/preferences/
Content-Type: application/json
Authorization: Bearer <token>

{
    "email_appointment_reminders": true,
    "sms_appointment_reminders": true,
    "email_system_alerts": true,
    "email_compliance_notifications": true,
    "email_credential_warnings": false
}
```

## 📋 Available Templates

### Pre-built Templates
1. **appointment_reminder** - Appointment reminders
2. **appointment_confirmation** - Appointment confirmations
3. **test_results** - Test results notifications
4. **prescription_ready** - Prescription pickup notifications
5. **emergency_alert** - Emergency alerts
6. **registration_confirmation** - Welcome messages
7. **password_reset** - Password reset notifications

### Template Variables
Each template supports dynamic variables:

**Appointment Templates:**
- `{{patient_name}}`
- `{{appointment_date}}`
- `{{appointment_time}}`
- `{{doctor_name}}`
- `{{clinic_name}}`
- `{{clinic_address}}`

**Test Results:**
- `{{patient_name}}`
- `{{test_name}}`
- `{{results_url}}`
- `{{clinic_name}}`

**Emergency Alerts:**
- `{{emergency_message}}`
- `{{timestamp}}`

## 🔧 Management Commands

### Setup Templates
```bash
python manage.py setup_notification_templates
```

### Update Existing Templates
```bash
python manage.py setup_notification_templates --update-existing
```

### Process Notification Queue
```bash
python manage.py process_notifications
```

### Continuous Processing
```bash
python manage.py process_notifications --continuous --interval 60
```

## 📊 Monitoring & Analytics

### Notification Statistics
```http
GET /api/hospital/notifications/status/
Authorization: Bearer <token>
```

Returns:
- Total notifications sent
- Success/failure rates
- Service usage statistics
- Pending scheduled notifications

### Scheduled Notifications
```http
GET /api/hospital/notifications/scheduled/
Authorization: Bearer <token>
```

## 🔒 Security & Privacy

### Authentication
- All endpoints require authentication
- Users can only see their own notifications (unless admin)
- Admins have full access to all notifications

### Data Protection
- Sensitive information is not logged
- Phone numbers and emails are stored securely
- HIPAA compliance considerations built-in

### Rate Limiting
- Built-in rate limiting to prevent abuse
- Configurable limits per user/time period

## 🚀 Advanced Features

### Quiet Hours
- Automatic quiet hours detection (9 PM - 8 AM)
- Non-critical SMS notifications are delayed
- Emergency alerts bypass quiet hours

### Retry Logic
- Automatic retry for failed notifications
- Configurable retry attempts
- Exponential backoff

### Provider Fallback
- Automatic fallback to Django SMTP if SendGrid fails
- SMS fails gracefully if Twilio not configured

### Queue Processing
- Background processing of scheduled notifications
- Batch processing for performance
- Priority-based processing

## 🧪 Testing

### Test the Service
```bash
python test_notifications.py
```

### Test API Endpoints
Use tools like Postman or curl to test the API endpoints with your authentication token.

### Example Test Request
```bash
curl -X POST http://localhost:8000/api/hospital/notifications/appointment-reminder/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "patient_email": "test@example.com",
    "patient_name": "Test Patient",
    "appointment_date": "2024-01-15",
    "appointment_time": "10:00 AM",
    "doctor_name": "Dr. Test",
    "clinic_name": "Test Clinic"
  }'
```

## 🔧 Troubleshooting

### Common Issues

1. **SMS not sending**
   - Check Twilio credentials
   - Verify phone number format (+1234567890)
   - Check Twilio account balance

2. **Email not sending**
   - Verify SendGrid API key
   - Check from email is verified in SendGrid
   - Test Django SMTP fallback

3. **Templates not found**
   - Run `setup_notification_templates` command
   - Check template is active
   - Verify template_type matches API call

### Debug Mode
Enable debug logging in settings:
```python
LOGGING = {
    'loggers': {
        'hospital.enhanced_notification_service': {
            'level': 'DEBUG',
        },
    },
}
```

## 📈 Production Deployment

### Environment Variables
Use environment variables for sensitive configuration:
```bash
export TWILIO_ACCOUNT_SID="your_sid"
export TWILIO_AUTH_TOKEN="your_token"
export SENDGRID_API_KEY="your_key"
```

### Celery Setup (Optional)
For high-volume installations, use Celery for background processing:
```bash
# Install Redis
pip install redis

# Start Celery worker
celery -A backend worker -l info

# Start Celery beat (for scheduled tasks)
celery -A backend beat -l info
```

### Monitoring
- Set up log monitoring for notification failures
- Monitor API response times
- Track delivery rates by provider

## 🤝 Contributing

To extend the notification system:

1. Add new templates in the database
2. Create new API endpoints in `notification_views.py`
3. Add URL patterns in `urls.py`
4. Create serializers for validation
5. Add tests for new functionality

## 📝 License

This notification service is part of the healthcare platform and follows the same licensing terms.
