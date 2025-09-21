# Clean up remaining test files
$testFiles = @(
    'debug_email_reset.py',
    'debug_password_reset.py', 
    'password_reset_debug_test.html',
    'quick_chatbot_test.py',
    'simple_test.py',
    'super_admin_access_tool.html',
    'test_aws_ses.py',
    'test_chatbot_integration.py',
    'test_dashboard.py',
    'test_email_debug.py',
    'test_env_recaptcha.py',
    'test_notification_system.py',
    'test_password_reset.py',
    'test_professional_chatbot.py',
    'test_user_creation.py'
)

foreach($file in $testFiles) {
    if(Test-Path $file) {
        if($file -like "debug_*") {
            Move-Item $file "test-documents\debugging-scripts\" -Force
            Write-Host "Moved $file to debugging-scripts folder"
        } else {
            Move-Item $file "test-documents\" -Force  
            Write-Host "Moved $file to test-documents folder"
        }
    }
}

Write-Host "Cleanup completed!"
Get-ChildItem "test-documents\" -Recurse | Measure-Object | Select-Object Count
