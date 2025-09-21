/**
 * Soft coding configuration for doctor profile edit functionality
 */

// Doctor Profile Edit Configuration using Soft Coding Techniques
export const DOCTOR_PROFILE_CONFIG = {
    API_ENDPOINTS: {
        base_url: "/api/medicine/doctors/",
        current_user: "/api/medicine/doctors/current_user/",
        update_profile: "/api/medicine/doctors/{id}/",
        statistics: "/api/medicine/doctors/{id}/statistics/",
        upload_image: "/api/medicine/doctors/{id}/upload_photo/"
    },
    
    FORM_SECTIONS: {
        personal_info: {
            title: "Personal Information",
            icon: "ri-user-line",
            color: "primary",
            fields: [
                {
                    name: "first_name",
                    label: "First Name",
                    type: "text",
                    required: true,
                    editable: true,
                    validation: "min_length:2,max_length:50"
                },
                {
                    name: "last_name", 
                    label: "Last Name",
                    type: "text",
                    required: true,
                    editable: true,
                    validation: "min_length:2,max_length:50"
                },
                {
                    name: "email",
                    label: "Email Address",
                    type: "email", 
                    required: true,
                    editable: false,
                    note: "Contact administrator to change email"
                }
            ]
        },
        
        professional_info: {
            title: "Professional Information",
            icon: "ri-hospital-line",
            color: "success",
            fields: [
                {
                    name: "license_number",
                    label: "Medical License Number",
                    type: "text",
                    required: true,
                    editable: true,
                    validation: "min_length:5,max_length:20"
                },
                {
                    name: "specialization",
                    label: "Medical Specialization",
                    type: "select",
                    required: true,
                    editable: true,
                    options: [
                        {value: "general", label: "General Medicine"},
                        {value: "emergency", label: "Emergency Medicine"},
                        {value: "internal", label: "Internal Medicine"},
                        {value: "family", label: "Family Medicine"},
                        {value: "cardiology", label: "Cardiology"},
                        {value: "pulmonology", label: "Pulmonology"},
                        {value: "gastroenterology", label: "Gastroenterology"},
                        {value: "nephrology", label: "Nephrology"},
                        {value: "endocrinology", label: "Endocrinology"},
                        {value: "rheumatology", label: "Rheumatology"},
                        {value: "hematology", label: "Hematology"},
                        {value: "oncology", label: "Oncology"},
                        {value: "neurology", label: "Neurology"},
                        {value: "psychiatry", label: "Psychiatry"},
                        {value: "geriatrics", label: "Geriatrics"},
                        {value: "intensive_care", label: "Intensive Care Medicine"}
                    ]
                },
                {
                    name: "qualification",
                    label: "Medical Qualification",
                    type: "select",
                    required: true,
                    editable: true,
                    options: [
                        {value: "MBBS", label: "MBBS"},
                        {value: "MD", label: "MD"},
                        {value: "DO", label: "DO"},
                        {value: "DNB", label: "DNB"},
                        {value: "DM", label: "DM"},
                        {value: "MCh", label: "MCh"},
                        {value: "FRCP", label: "FRCP"},
                        {value: "FACS", label: "FACS"}
                    ]
                },
                {
                    name: "years_experience",
                    label: "Years of Experience",
                    type: "number",
                    required: true,
                    editable: true,
                    validation: "min:0,max:50"
                }
            ]
        },
        
        contact_info: {
            title: "Contact Information",
            icon: "ri-phone-line",
            color: "info",
            fields: [
                {
                    name: "phone_number",
                    label: "Phone Number",
                    type: "tel",
                    required: false,
                    editable: true,
                    placeholder: "+1 (555) 123-4567"
                }
            ]
        },
        
        additional_info: {
            title: "Additional Information",
            icon: "ri-information-line",
            color: "warning",
            fields: [
                {
                    name: "education",
                    label: "Education & Training",
                    type: "textarea",
                    required: false,
                    editable: true,
                    rows: 3,
                    placeholder: "List your medical education, training, and certifications"
                },
                {
                    name: "certifications", 
                    label: "Professional Certifications",
                    type: "textarea",
                    required: false,
                    editable: true,
                    rows: 2,
                    placeholder: "Board certifications, fellowships, etc."
                },
                {
                    name: "hospital_affiliation",
                    label: "Hospital/Clinic Affiliation",
                    type: "text",
                    required: false,
                    editable: true,
                    placeholder: "Primary hospital or clinic affiliation"
                },
                {
                    name: "consultation_fee",
                    label: "Consultation Fee",
                    type: "number",
                    required: false,
                    editable: true,
                    validation: "min:0",
                    step: "0.01",
                    prefix: "$"
                },
                {
                    name: "bio",
                    label: "Professional Biography",
                    type: "textarea",
                    required: false,
                    editable: true,
                    rows: 4,
                    placeholder: "Brief professional biography and areas of expertise"
                },
                {
                    name: "is_available_emergency",
                    label: "Available for Emergency Calls",
                    type: "switch",
                    required: false,
                    editable: true,
                    note: "Check if available for emergency consultations outside regular hours"
                }
            ]
        }
    },
    
    VALIDATION_RULES: {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        license_number: /^[A-Z0-9]{5,20}$/,
        phone_number: /^[\+]?[1-9][\d]{0,15}$/
    },
    
    UI_SETTINGS: {
        max_height: "75vh",
        animation_duration: "0.3s",
        card_border_radius: "12px",
        primary_color: "#0d6efd",
        success_color: "#198754",
        info_color: "#0dcaf0",
        warning_color: "#ffc107",
        form_spacing: "1rem"
    },
    
    FEATURE_FLAGS: {
        enable_image_upload: true,
        enable_realtime_validation: true,
        enable_auto_save: false,
        enable_progress_tracking: true,
        enable_advanced_fields: true,
        show_statistics: true
    },
    
    ERROR_MESSAGES: {
        network_error: "Network error occurred. Please check your connection and try again.",
        validation_error: "Please fix the highlighted errors before saving.",
        unauthorized: "You don't have permission to edit this profile.",
        not_found: "Doctor profile not found.",
        save_success: "Profile updated successfully!",
        save_error: "Failed to save profile. Please try again."
    },
    
    NAVIGATION: {
        back_url: "/doctor/doctor-list",
        profile_url: "/doctor/doctor-profile",
        dashboard_url: "/dashboard"
    }
};

// Helper functions for soft coding
export const getFieldByName = (fieldName) => {
    for (const section of Object.values(DOCTOR_PROFILE_CONFIG.FORM_SECTIONS)) {
        const field = section.fields.find(f => f.name === fieldName);
        if (field) return field;
    }
    return null;
};

export const getValidationRule = (fieldName) => {
    return DOCTOR_PROFILE_CONFIG.VALIDATION_RULES[fieldName] || null;
};

export const isFieldEditable = (fieldName) => {
    const field = getFieldByName(fieldName);
    return field ? field.editable : false;
};

export const isFieldRequired = (fieldName) => {
    const field = getFieldByName(fieldName);
    return field ? field.required : false;
};

export const getFieldOptions = (fieldName) => {
    const field = getFieldByName(fieldName);
    return field?.options || [];
};

// Default values for new doctor profiles
export const DEFAULT_DOCTOR_VALUES = {
    first_name: '',
    last_name: '',
    email: '',
    license_number: '',
    specialization: 'general',
    qualification: 'MBBS',
    years_experience: 0,
    phone_number: '',
    education: '',
    certifications: '',
    hospital_affiliation: '',
    consultation_fee: 0,
    bio: '',
    is_available_emergency: false
};

console.log('Doctor Profile Configuration loaded successfully!');
console.log(`Configured ${Object.keys(DOCTOR_PROFILE_CONFIG.FORM_SECTIONS).length} form sections`);

export default DOCTOR_PROFILE_CONFIG;
