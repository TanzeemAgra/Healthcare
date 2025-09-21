#!/usr/bin/env python3
"""
Test AWS SES email sending directly
"""
import boto3
import os
from botocore.exceptions import ClientError

# Load environment variables
import sys
sys.path.append('backend')

def test_aws_ses():
    """Test AWS SES configuration and email sending"""
    
    print("=== AWS SES EMAIL TEST ===")
    
    # AWS SES configuration from environment variables
    aws_access_key = os.getenv("AWS_ACCESS_KEY_ID", "your-aws-access-key")
    aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY", "your-aws-secret-key")  
    aws_region = os.getenv("AWS_REGION", "ap-south-1")
    
    try:
        # Create SES client
        print("🔧 Creating AWS SES client...")
        ses_client = boto3.client(
            'ses',
            aws_access_key_id=aws_access_key,
            aws_secret_access_key=aws_secret_key,
            region_name=aws_region
        )
        
        # Check SES identity status
        print("📧 Checking verified email identities...")
        identities = ses_client.list_verified_email_addresses()
        print(f"✅ Verified email addresses: {identities.get('VerifiedEmailAddresses', [])}")
        
        # Check sending quota
        print("📊 Checking sending quota...")
        quota = ses_client.get_send_quota()
        print(f"✅ Daily send quota: {quota.get('Max24HourSend', 0)}")
        print(f"✅ Max send rate: {quota.get('MaxSendRate', 0)} emails/second")
        print(f"✅ Sent last 24h: {quota.get('SentLast24Hours', 0)}")
        
        # Test email sending (if we have verified addresses)
        verified_emails = identities.get('VerifiedEmailAddresses', [])
        if verified_emails:
            from_email = verified_emails[0]
            to_email = from_email  # Send to ourselves for testing
            
            print(f"📤 Attempting to send test email from {from_email} to {to_email}...")
            
            response = ses_client.send_email(
                Source=from_email,
                Destination={'ToAddresses': [to_email]},
                Message={
                    'Subject': {'Data': 'AWS SES Test Email'},
                    'Body': {
                        'Text': {'Data': 'This is a test email from AWS SES to verify configuration.'},
                        'Html': {'Data': '<h1>AWS SES Test</h1><p>This is a test email from AWS SES to verify configuration.</p>'}
                    }
                }
            )
            
            print(f"✅ Email sent successfully! Message ID: {response.get('MessageId')}")
            
        else:
            print("⚠️  No verified email addresses found. You need to verify an email address in AWS SES.")
            print("   Go to AWS SES Console and verify 'info@xerxez.in' or add other email addresses.")
        
        return True
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_message = e.response['Error']['Message']
        print(f"❌ AWS SES Error [{error_code}]: {error_message}")
        
        if error_code == 'InvalidParameterValue':
            print("💡 This usually means the email address is not verified in AWS SES.")
        elif error_code == 'MessageRejected':
            print("💡 The message was rejected. Check your email content and recipient.")
        elif error_code == 'SendingPausedException':
            print("💡 Your account's email sending is paused.")
        
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    test_aws_ses()
