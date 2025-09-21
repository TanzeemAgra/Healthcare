// Frontend Registration Form Auto-Fill Test Script
// Paste this into browser console at http://localhost:5173/auth/registration

console.log('🚀 Starting Registration Form Auto-Fill Test');

// Step 1: Personal Information
function fillPersonalInfo() {
    console.log('📝 Filling Personal Information...');
    
    // Fill basic info
    document.querySelector('input[name="firstName"]').value = 'Dr. Ahmed';
    document.querySelector('input[name="lastName"]').value = 'Khan';
    document.querySelector('input[name="dateOfBirth"]').value = '1985-05-15';
    
    // Select gender (if radio button)
    const genderRadio = document.querySelector('input[name="gender"][value="Male"]');
    if (genderRadio) genderRadio.checked = true;
    
    document.querySelector('input[name="nationality"]').value = 'Indian';
    
    console.log('✅ Personal Information filled');
}

// Step 2: Contact Information  
function fillContactInfo() {
    console.log('📧 Filling Contact Information...');
    
    document.querySelector('input[name="email"]').value = 'tanzeem.agra@rugrel.com';
    document.querySelector('input[name="confirmEmail"]').value = 'tanzeem.agra@rugrel.com';
    document.querySelector('input[name="phone"]').value = '+91-9876543210';
    document.querySelector('input[name="address"]').value = '123 Medical Plaza';
    document.querySelector('input[name="city"]').value = 'Mumbai';
    document.querySelector('input[name="zipCode"]').value = '400001';
    
    // Select country (if dropdown)
    const countrySelect = document.querySelector('select[name="country"]');
    if (countrySelect) countrySelect.value = 'India';
    
    console.log('✅ Contact Information filled');
}

// Step 3: Professional Information
function fillProfessionalInfo() {
    console.log('👩‍⚕️ Filling Professional Information...');
    
    document.querySelector('input[name="professionalTitle"]').value = 'Cardiologist';
    document.querySelector('input[name="medicalLicenseNumber"]').value = 'MD12345';
    document.querySelector('input[name="licenseIssuingAuthority"]').value = 'Indian Medical Council';
    document.querySelector('input[name="licenseExpiryDate"]').value = '2026-12-31';
    document.querySelector('input[name="specialization"]').value = 'Cardiology';
    document.querySelector('input[name="yearsOfExperience"]').value = '8';
    document.querySelector('input[name="currentWorkplace"]').value = 'Delhi Heart Institute';
    
    console.log('✅ Professional Information filled');
}

// Step 4: Account Security
function fillAccountSecurity() {
    console.log('🔒 Filling Account Security...');
    
    document.querySelector('input[name="username"]').value = 'drakhan123';
    document.querySelector('input[name="password"]').value = 'SecurePass123!';
    document.querySelector('input[name="confirmPassword"]').value = 'SecurePass123!';
    
    // Security questions
    const secQ1 = document.querySelector('select[name="securityQuestion1"]');
    if (secQ1) secQ1.value = "What is your mother's maiden name?";
    
    document.querySelector('input[name="securityAnswer1"]').value = 'Smith';
    
    const secQ2 = document.querySelector('select[name="securityQuestion2"]');
    if (secQ2) secQ2.value = "What was your first pet's name?";
    
    document.querySelector('input[name="securityAnswer2"]').value = 'Buddy';
    
    console.log('✅ Account Security filled');
}

// Step 5: Emergency Contact
function fillEmergencyContact() {
    console.log('🆘 Filling Emergency Contact...');
    
    document.querySelector('input[name="emergencyContact"]').value = 'Dr. Sarah Khan';
    document.querySelector('input[name="emergencyContactPhone"]').value = '+91-9876543211';
    
    console.log('✅ Emergency Contact filled');
}

// Step 6: Terms and Agreements
function checkAgreements() {
    console.log('📋 Checking Terms and Agreements...');
    
    const checkboxes = [
        'agreeToTerms',
        'agreeToPrivacy', 
        'gdprConsent',
        'hipaaAgreement',
        'termsAccepted',
        'dataProcessingConsent'
    ];
    
    checkboxes.forEach(name => {
        const checkbox = document.querySelector(`input[name="${name}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    console.log('✅ All agreements checked');
}

// Main test function
async function runRegistrationTest() {
    console.log('🎯 Starting Complete Registration Test');
    console.log('=' + '='.repeat(50));
    
    try {
        // Fill all sections
        fillPersonalInfo();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        fillContactInfo();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        fillProfessionalInfo();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        fillAccountSecurity();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        fillEmergencyContact();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        checkAgreements();
        await new Promise(resolve => setTimeout(resolve, 500));
        
        console.log('🎉 Form auto-fill complete!');
        console.log('📧 Expected Email Results:');
        console.log('   • Registration confirmation to tanzeem.agra@rugrel.com');
        console.log('   • Admin approval notification with enhanced templates');
        console.log('   • Professional styling with risk assessment');
        console.log('');
        console.log('🔄 Now click SUBMIT to test the enhanced email system!');
        
        // Highlight the submit button
        const submitBtn = document.querySelector('button[type="submit"]') || document.querySelector('.submit-button');
        if (submitBtn) {
            submitBtn.style.backgroundColor = '#00ff00';
            submitBtn.style.color = '#000';
            submitBtn.style.border = '3px solid #ff0000';
            submitBtn.style.animation = 'pulse 1s infinite';
            console.log('🟢 SUBMIT BUTTON HIGHLIGHTED - Click to test emails!');
        }
        
    } catch (error) {
        console.error('❌ Error during auto-fill:', error);
        console.log('💡 Try running individual functions manually:');
        console.log('   • fillPersonalInfo()');
        console.log('   • fillContactInfo()');
        console.log('   • fillProfessionalInfo()');
        console.log('   • fillAccountSecurity()');
        console.log('   • fillEmergencyContact()');
        console.log('   • checkAgreements()');
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Run the test
runRegistrationTest();
