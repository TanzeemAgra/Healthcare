import React, { useContext, useState } from 'react';
import {
  Accordion,
  AccordionContext,
  Nav,
  OverlayTrigger,
  Tooltip,
  useAccordionButton,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { usePermissions } from '../../../contexts/PermissionContext';

const VerticalNav = () => {
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(false);
  const [active, setActive] = useState('');
  
  // Add permission context
  const {
    canAccessMedicineModule,
    canAccessDentistryModule,
    canAccessDermatologyModule,
    canAccessPathologyModule,
    canAccessRadiologyModule,
    canAccessDoctorManagement,
    canAccessHomeopathyModule,
    canAccessCosmetologyModule,
    canAccessAllopathyModule,
    canAccessDnaSequencingModule,
    canAccessSecureneatModule,
    canAccessUserManagement,
    canAccessPatientManagement,
    canAccessHospitalManagement,
    canAccessClinicManagement,
    isSuperAdmin,
    loading: permissionsLoading
  } = usePermissions();

  const SecureNeatItems = [
    {
      path: '/SecureNeat/dashboard',
      name: 'Dashboard',
      icon: 'ri-dashboard-fill',
    },
    {
      path: '/SecureNeat/chat',
      name: 'Dr Max Bot',
      icon: 'ri-robot-2-fill',
    },
    {
      path: '/SecureNeat/mcq-practice',
      name: 'MCQ Practice',
      icon: 'ri-checkbox-circle-fill',
    },
    {
      path: '/SecureNeat/osce-scenario',
      name: 'OSCE Scenario',
      icon: 'ri-stethoscope-fill',
    },
    {
      path: '/SecureNeat/s3-data-manager',
      name: 'S3 Data Manager',
      icon: 'ri-database-2-fill',
    },
    { path: '/SecureNeat/profile', name: 'Profile', icon: 'ri-user-3-fill' },
  ];

  const medicineItems = [
    { path: "/medicine/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/medicine/general", name: "General Medicine", icon: "ri-stethoscope-fill" },
    { path: "/medicine/emergency", name: "Emergency Medicine", icon: "ri-first-aid-kit-fill" },
    { path: "/medicine/diabetes-tracker", name: "Diabetes Patient Tracker", icon: "ri-heart-pulse-fill" },
    { path: "/medicine/diabetic-retinopathy", name: "Diabetic Retinopathy AI", icon: "ri-eye-fill" },
    { path: "/medicine/s3-data-manager-demo", name: "S3 Data Manager Demo", icon: "ri-database-2-fill", badge: "S3" },
  ];

  const radiologyItems = [
    // Core Features
    { path: "/radiology/home", name: "Dashboard", icon: "ri-dashboard-3-fill" },
    
    // AI-Powered Analysis
    { path: "/radiology/analyze-report", name: "AI Report Analysis", icon: "ri-ai-generate", badge: "AI" },
    { path: "/radiology/advanced-rads-calculator", name: "AI RADS Calculator", icon: "ri-brain-fill", badge: "NEW" },
    { path: "/radiology/anonymize", name: "Document Anonymizer", icon: "ri-shield-user-fill" },
    
    // Clinical Tools
    { path: "/radiology/report-templates", name: "Report Templates", icon: "ri-file-text-fill" },
    { path: "/radiology/clinical-reference", name: "Clinical Reference", icon: "ri-book-open-fill" },
    
    // Patient Management
    { path: "/radiology/patient-registry", name: "Patient Registry", icon: "ri-user-heart-fill" },
    { path: "/radiology/imaging-schedule", name: "Imaging Schedule", icon: "ri-calendar-schedule-fill" },
    { path: "/radiology/study-tracking", name: "Study Tracking", icon: "ri-search-eye-fill" },
    
    // Data & History
    { path: "/radiology/history", name: "Report History", icon: "ri-history-fill" },
    { path: "/radiology/data-manager", name: "S3 Data Manager", icon: "ri-database-2-fill", badge: "S3" },
  ];

  const dentistryItems = [
    { path: "/dentistry/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/dentistry/patients", name: "Patients", icon: "ri-user-3-fill" },
    { path: "/dentistry/appointments", name: "Appointments", icon: "ri-calendar-fill" },
    { path: "/dentistry/treatments", name: "Treatments", icon: "ri-medicine-bottle-fill" },
    { path: "/dentistry/ai-analysis", name: "AI Analysis", icon: "ri-brain-fill" },
    { path: "/dentistry/emergencies", name: "Emergencies", icon: "ri-alarm-warning-fill" },
    { path: "/dentistry/s3-manager", name: "S3 Data Manager", icon: "ri-database-2-fill", badge: "S3" },
  ];

  const dermatologyItems = [
    { path: "/dermatology/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/dermatology/patients", name: "Patients", icon: "ri-user-3-fill" },
    { path: "/dermatology/consultations", name: "Consultations", icon: "ri-stethoscope-fill" },
    { path: "/dermatology/skin-conditions", name: "Skin Conditions", icon: "ri-heart-pulse-fill" },
    { path: "/dermatology/ai-analysis", name: "AI Analysis", icon: "ri-brain-fill" },
    { path: "/dermatology/treatment-plans", name: "Treatment Plans", icon: "ri-file-list-3-fill" },
    { path: "/dermatology/s3-manager", name: "S3 Data Manager", icon: "ri-database-2-fill", badge: "S3" },
  ];

  const pathologyItems = [
    { path: "/pathology/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/pathology/departments", name: "Departments", icon: "ri-building-fill" },
    { path: "/pathology/tests", name: "Lab Tests", icon: "ri-test-tube-fill" },
    { path: "/pathology/reports", name: "Reports", icon: "ri-file-text-fill" },
    { path: "/pathology/specimens", name: "Specimens", icon: "ri-drop-fill" },
    { path: "/pathology/analytics", name: "Analytics", icon: "ri-bar-chart-box-fill" },
    { path: "/pathology/s3-manager", name: "S3 Data Manager", icon: "ri-database-2-fill", badge: "S3" },
  ];

  const homeopathyItems = [
    { path: "/homeopathy/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/homeopathy/case-taking", name: "Case Taking", icon: "ri-user-heart-fill" },
    { path: "/homeopathy/repertorization", name: "Repertorization", icon: "ri-brain-fill" },
    { path: "/homeopathy/remedy-database", name: "Remedy Database", icon: "ri-medicine-bottle-fill" },
    { path: "/homeopathy/patients", name: "Patients", icon: "ri-team-fill" },
    { path: "/homeopathy/prescriptions", name: "Prescriptions", icon: "ri-file-text-line" },
    { path: "/homeopathy/s3-manager", name: "S3 Data Manager", icon: "ri-database-2-fill", badge: "S3" },
  ];

  const cosmetologyItems = [
    { path: "/cosmetology/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/cosmetology/clients", name: "Client Management", icon: "ri-user-3-fill" },
    { path: "/cosmetology/services", name: "Beauty Services", icon: "ri-scissors-2-fill" },
    { path: "/cosmetology/appointments", name: "Appointments", icon: "ri-calendar-fill" },
    { path: "/cosmetology/treatments", name: "Treatment Plans", icon: "ri-file-list-3-fill" },
    { path: "/cosmetology/s3-manager", name: "S3 Data Manager", icon: "ri-database-2-fill", badge: "S3" },
    { path: "/cosmetology/products", name: "Product Inventory", icon: "ri-shopping-bag-fill" },
    { path: "/cosmetology/consultations", name: "Consultations", icon: "ri-chat-3-fill" },
    { path: "/cosmetology/gynecology", name: "Cosmetic Gynecology", icon: "ri-user-heart-fill", badge: "AI" },
  ];

  const allopathyItems = [
    { path: "/allopathy", name: "Main Module", icon: "ri-stethoscope-fill" },
    { path: "/allopathy/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/allopathy/diagnosis", name: "AI Diagnosis", icon: "ri-brain-fill" },
    { path: "/allopathy/drug-checker", name: "Drug Checker", icon: "ri-medicine-bottle-fill" },
    { path: "/allopathy/clinical-notes", name: "Clinical Notes", icon: "ri-file-text-fill" },
    { path: "/allopathy/s3-data-manager", name: "S3 Data Manager", icon: "ri-cloud-fill" },
  ];

  const dnaSequencingItems = [
    { path: "/dna-sequencing/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    { path: "/dna-sequencing/analysis", name: "Genome Analysis", icon: "ri-microscope-fill" },
    { path: "/dna-sequencing/samples", name: "Sample Management", icon: "ri-test-tube-fill" },
    { path: "/dna-sequencing/variant-calling", name: "Variant Calling", icon: "ri-git-branch-fill" },
    { path: "/dna-sequencing/quality-control", name: "Quality Control", icon: "ri-shield-check-fill" },
    { path: "/dna-sequencing/ai-lab", name: "AI Genomics Lab", icon: "ri-brain-fill" },
    { path: "/dna-sequencing/s3-data-manager", name: "S3 Data Manager", icon: "ri-cloud-fill" },
    { path: "/dna-sequencing/reports", name: "Reports", icon: "ri-file-chart-fill" },
  ];

  const adminItems = [
    // Core Admin
    { path: "/admin/dashboard", name: "Dashboard", icon: "ri-dashboard-fill" },
    
    // User Management
    { path: "/admin/user-management", name: "User Management", icon: "ri-user-settings-fill" },
    { path: "/admin/staff-management", name: "Staff Management", icon: "ri-team-fill" },
    
    // Business Management
    { path: "/admin/analytics", name: "Analytics", icon: "ri-bar-chart-box-fill" },
    
    // System Control
    { path: "/admin/system-settings", name: "System Settings", icon: "ri-settings-3-fill" },
    { path: "/admin/security", name: "Security", icon: "ri-shield-check-fill" },
    { path: "/admin/access-test", name: "Access Test", icon: "ri-shield-user-fill" },
    // Debug/Development items removed for production
    { path: "/admin/notifications", name: "Notifications", icon: "ri-notification-3-fill" },
    
    // Maintenance
    { path: "/admin/backup", name: "Backup", icon: "ri-database-2-fill" },
    { path: "/admin/logs", name: "System Logs", icon: "ri-file-list-3-fill" },
  ];

  // Soft coding: Feature flags for admin items
  const ADMIN_FEATURES = {
    ACCESS_TEST: true, // Can be disabled in production if not needed
    SYSTEM_BACKUP: true,
    SECURITY_SETTINGS: true,
    NOTIFICATIONS: true
  };

  // Filter admin items based on permissions and feature flags
  const getFilteredAdminItems = () => {
    return adminItems.filter(item => {
      // Always show core admin items
      if (item.path === "/admin/dashboard") return true;
      
      // User management items - require user management permission
      if (item.path === "/admin/user-management" || item.path === "/admin/staff-management") {
        return canAccessUserManagement;
      }
      
      // System control items - require user management permission or super admin
      if (item.path === "/admin/system-settings" || item.path === "/admin/security") {
        return canAccessUserManagement || isSuperAdmin;
      }
      
      // Access Test - require user management permission and feature flag
      if (item.path === "/admin/access-test") {
        return ADMIN_FEATURES.ACCESS_TEST && (canAccessUserManagement || isSuperAdmin);
      }
      
      // System Logs - require user management permission
      if (item.path === "/admin/logs") {
        return canAccessUserManagement || isSuperAdmin;
      }
      
      // Backup - require super admin or feature flag
      if (item.path === "/admin/backup") {
        return ADMIN_FEATURES.SYSTEM_BACKUP && (canAccessUserManagement || isSuperAdmin);
      }
      
      // Analytics - always show if user has admin access
      if (item.path === "/admin/analytics") {
        return canAccessUserManagement || isSuperAdmin;
      }
      
      // Notifications - feature flag controlled
      if (item.path === "/admin/notifications") {
        return ADMIN_FEATURES.NOTIFICATIONS && (canAccessUserManagement || isSuperAdmin);
      }
      
      // Default: require user management permission
      return canAccessUserManagement || isSuperAdmin;
    });
  };

  const emailItems = [
    { path: '/email/inbox', name: 'Inbox', icon: 'ri-inbox-fill' },
    {
      path: '/email/email-compose',
      name: 'Email Compose',
      icon: 'ri-edit-2-fill',
    },
  ];

  const doctorItems = [
    {
      path: '/doctor/doctor-list',
      name: 'All Doctor',
      icon: 'ri-file-list-fill',
    },
    {
      path: '/doctor/add-doctor',
      name: 'Add Doctor',
      icon: 'ri-user-add-fill',
    },
    {
      path: '/doctor/doctor-profile',
      name: 'Doctor Profile',
      icon: 'ri-profile-fill',
    },
    {
      path: '/doctor/edit-doctor',
      name: 'Edit Doctor',
      icon: 'ri-file-edit-fill',
    },
  ];

  const uiElementsItems = [
    { path: '/ui-elements/colors', name: 'Colors', icon: 'ri-font-color' },
    { path: '/ui-elements/typography', name: 'Typography', icon: 'ri-text' },
    { path: '/ui-elements/alerts', name: 'Alerts', icon: 'ri-alert-fill' },
    { path: '/ui-elements/badges', name: 'Badges', icon: 'ri-building-3-fill' },
    {
      path: '/ui-elements/breadcrumb',
      name: 'Breadcrumb',
      icon: 'ri-guide-fill',
    },
    {
      path: '/ui-elements/buttons',
      name: 'Buttons',
      icon: 'ri-checkbox-blank-fill',
    },
    { path: '/ui-elements/cards', name: 'Cards', icon: 'ri-bank-card-fill' },
    {
      path: '/ui-elements/carousel',
      name: 'Carousel',
      icon: 'ri-slideshow-4-fill',
    },
    { path: '/ui-elements/video', name: 'Video', icon: 'ri-movie-fill' },
    { path: '/ui-elements/grid', name: 'Grid', icon: 'ri-grid-fill' },
    { path: '/ui-elements/images', name: 'Images', icon: 'ri-image-fill' },
    {
      path: '/ui-elements/list-group',
      name: 'List Group',
      icon: 'ri-file-list-fill',
    },
    {
      path: '/ui-elements/modal',
      name: 'Modal',
      icon: 'ri-checkbox-blank-fill',
    },
    {
      path: '/ui-elements/notifications',
      name: 'Notifications',
      icon: 'ri-notification-3-fill',
    },
    {
      path: '/ui-elements/pagination',
      name: 'Pagination',
      icon: 'ri-more-fill',
    },
    {
      path: '/ui-elements/popovers',
      name: 'Popovers',
      icon: 'ri-folder-shield-fill',
    },
    {
      path: '/ui-elements/progressbars',
      name: 'Progressbars',
      icon: 'ri-battery-low-fill',
    },
    { path: '/ui-elements/tabs', name: 'Tabs', icon: 'ri-database-fill' },
    {
      path: '/ui-elements/tooltips',
      name: 'Tooltips',
      icon: 'ri-record-mail-fill',
    },
  ];

  const formItems = [
    {
      path: '/forms/form-elements',
      name: 'Form Elements',
      icon: 'ri-tablet-fill',
    },
    {
      path: '/forms/form-validations',
      name: 'Form Validation',
      icon: 'ri-device-fill',
    },
    { path: '/forms/form-switch', name: 'Form Switch', icon: 'ri-toggle-fill' },
    {
      path: '/forms/form-checkbox',
      name: 'Form Checkbox',
      icon: 'ri-chat-check-fill',
    },
    {
      path: '/forms/form-radio',
      name: 'Form Radio',
      icon: 'ri-radio-button-fill',
    },
  ];

  const formWizardItems = [
    {
      path: '/wizard/simple-wizard',
      name: 'Simple Wizard',
      icon: 'ri-anticlockwise-fill',
    },
    {
      path: '/wizard/validate-wizard',
      name: 'Validate Wizard',
      icon: 'ri-anticlockwise-2-fill',
    },
    {
      path: '/wizard/vertical-wizard',
      name: 'Vertical Wizard',
      icon: 'ri-clockwise-fill',
    },
  ];

  const tableItems = [
    {
      path: '/tables/basic-table',
      name: 'Basic Tables',
      icon: 'ri-table-fill',
    },
    { path: '/tables/data-table', name: 'Data Tables', icon: 'ri-table-2' },
    {
      path: '/tables/editable-table',
      name: 'Editable Tables',
      icon: 'ri-archive-drawer-fill',
    },
  ];

  const chartItems = [
    {
      path: '/charts/chart-page',
      name: 'Chart Page',
      icon: 'ri-file-chart-fill',
    },
    { path: '/charts/e-chart', name: 'ECharts', icon: 'ri-bar-chart-fill' },
    {
      path: '/charts/chart-am',
      name: 'Am Charts',
      icon: 'ri-bar-chart-box-fill',
    },
    {
      path: '/charts/apex-chart',
      name: 'Apex Chart',
      icon: 'ri-bar-chart-box-fill',
    },
  ];

  const iconItems = [
    { path: '/icons/dripicons', name: 'Dripicons', icon: 'ri-stack-fill' },
    {
      path: '/icons/fontawesome-5',
      name: 'Font Awesome 5',
      icon: 'ri-facebook-fill',
    },
    {
      path: '/icons/line-awesome',
      name: 'Line Awesome',
      icon: 'ri-keynote-fill',
    },
    { path: '/icons/remixicon', name: 'Remixicon', icon: 'ri-remixicon-fill' },
    { path: '/icons/unicons', name: 'Unicons', icon: 'ri-underline' },
  ];

  const authItems = [
    { path: '/login', name: 'Login', icon: 'ri-login-box-fill' },
    { path: '/auth/sign-up', name: 'Register', icon: 'ri-logout-box-fill' },
    {
      path: '/auth/recover-password',
      name: 'Recover Password',
      icon: 'ri-record-mail-fill',
    },
    {
      path: '/auth/confirm-mail',
      name: 'Confirm Mail',
      icon: 'ri-chat-check-fill',
    },
    {
      path: '/auth/lock-screen',
      name: 'Lock Screen',
      icon: 'ri-file-lock-fill',
    },
  ];

  const extraPagesItems = [
    {
      path: '/extra-pages/pages-timeline',
      name: 'Timeline',
      icon: 'ri-map-pin-time-fill',
    },
    {
      path: '/extra-pages/pages-invoice',
      name: 'Invoice',
      icon: 'ri-question-answer-fill',
    },
    {
      path: '/extra-pages/blank-page',
      name: 'Blank Page',
      icon: 'ri-checkbox-blank-fill',
    },
    {
      path: '/extra-pages/pages-error-404',
      name: 'Error 404',
      icon: 'ri-error-warning-fill',
    },
    {
      path: '/extra-pages/pages-error-500',
      name: 'Error 500',
      icon: 'ri-error-warning-fill',
    },
    {
      path: '/extra-pages/pages-pricing',
      name: 'Pricing',
      icon: 'ri-price-tag-3-fill',
    },
    {
      path: '/extra-pages/pages-pricing-one',
      name: 'Pricing 1',
      icon: 'ri-price-tag-2-fill',
    },
    {
      path: '/extra-pages/pages-maintenance',
      name: 'Maintenance',
      icon: 'ri-git-repository-commits-fill',
    },
    {
      path: '/extra-pages/pages-comingsoon',
      name: 'Coming Soon',
      icon: 'ri-run-fill',
    },
    {
      path: '/extra-pages/pages-faq',
      name: 'Faq',
      icon: 'ri-compasses-2-fill',
    },
  ];

  function CustomToggle({ children, eventKey, onClick, activeClass }) {
    const { activeEventKey } = useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, (active) =>
      onClick({ state: !active, eventKey: eventKey })
    );

    const isCurrentEventKey = activeEventKey === eventKey;

    return (
      <Link
        to='#'
        aria-expanded={isCurrentEventKey ? 'true' : 'false'}
        className={`nav-link ${activeEventKey === active || (eventKey === active && 'active')
          } ${activeClass === true ? 'active' : ''}`}
        role='button'
        onClick={(e) => {
          decoratedOnClick(isCurrentEventKey);
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <>
      <ul className='navbar-nav iq-main-menu' id='sidebar-menu'>
        <Nav.Item as='li' className='static-item ms-2'>
          <Link
            className='nav-link static-item disabled text-start'
            tabIndex='-1'
          >
            <span className='default-icon'>Dashboard</span>
            <OverlayTrigger
              key={'Home'}
              placement={'right'}
              overlay={<Tooltip id='Home'>Home</Tooltip>}
            >
              <span className='mini-icon'>-</span>
            </OverlayTrigger>
          </Link>
        </Nav.Item>

        <Nav.Item as='li'>
          <Link
            to='/dashboard'
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <OverlayTrigger
              key={'DDashboard'}
              placement={'right'}
              overlay={<Tooltip id='Dashboard'>Dashboard</Tooltip>}
            >
              <i className='ri-hospital-fill'></i>
            </OverlayTrigger>
            <span className='item-name'>Main Dashboard</span>
          </Link>
        </Nav.Item>

        {/* Hospital Management - Only show if user has permission */}
        {canAccessHospitalManagement() && (
          <Nav.Item as='li'>
            <Link
              to='/dashboard-pages/dashboard-1'
              className={`nav-link ${location.pathname === '/dashboard-pages/dashboard-1'
                ? 'active'
                : ''
                }`}
            >
              <OverlayTrigger
                key={'HDashboard'}
                placement={'right'}
                overlay={<Tooltip id='Dashboard'>Dashboard</Tooltip>}
              >
                <i
                  className='ri-home-8-fill'
                  data-bs-toggle='tooltip'
                  title='Dashboard'
                  data-bs-placement='right'
                ></i>
              </OverlayTrigger>
              <span className='item-name '>Hospital Management </span>
            </Link>
          </Nav.Item>
        )}

        {/* Clinic Management - Only show if user has permission */}
        {canAccessClinicManagement() && (
          <Nav.Item as='li'>
            <Link
              to='/dashboard-pages/dashboard-2'
              className={`nav-link ${location.pathname === '/dashboard-pages/dashboard-2'
                ? 'active'
                : ''
                }`}
            >
              <OverlayTrigger
                key={'HDashboard2'}
                placement={'right'}
                overlay={<Tooltip id='Dashboard'>Dashboard</Tooltip>}
              >
                <i className='ri-briefcase-4-fill'></i>
              </OverlayTrigger>
              <span className='item-name '>Clinic Management</span>
            </Link>
          </Nav.Item>
        )}

        {/* Patient Management - Only show if user has permission */}
        {canAccessPatientManagement() && (
          <Nav.Item as='li'>
            <Link
              to='/dashboard-pages/patient-dashboard'
              className={`nav-link ${location.pathname === '/dashboard-pages/patient-dashboard'
                ? 'active'
                : ''
                }`}
            >
              <OverlayTrigger
                key={'PDashboard'}
                placement={'right'}
                overlay={<Tooltip id='Dashboard'>Dashboard</Tooltip>}
              >
                <i className='ri-briefcase-4-fill'></i>
              </OverlayTrigger>
              <span className='item-name '>Patient Management</span>
            </Link>
          </Nav.Item>
        )}

        {/* Doctor Section - Only show if user has permission */}
        {canAccessDoctorManagement() && (
          <Nav.Item as='li'>
            <Link
              to='/doctor/doctor-list'
              className={`nav-link ${location.pathname === '/doctor/doctor-list' ? 'active' : ''
                }`}
            >
              <OverlayTrigger
                key={'AllDoctor'}
                placement='right'
                overlay={<Tooltip id='AllDoctor'>All Doctor</Tooltip>}
              >
                <i className='ri-file-list-fill' />
              </OverlayTrigger>
              <span className='item-name'>All Doctors</span>
            </Link>
          </Nav.Item>
        )}

        {canAccessDoctorManagement() && (
          <Nav.Item as='li'>
            <Link
              to='/doctor/add-doctor'
              className={`nav-link ${location.pathname === '/doctor/add-doctor' ? 'active' : ''
                }`}
            >
              <OverlayTrigger
                key={'AddDoctor'}
              placement='right'
              overlay={<Tooltip id='AddDoctor'>Add Doctor</Tooltip>}
            >
              <i className='ri-user-add-fill' />
            </OverlayTrigger>
            <span className='item-name'>Add Doctor</span>
          </Link>
        </Nav.Item>
        )}

        {canAccessDoctorManagement() && (
          <Nav.Item as='li'>
            <Link
              to='/doctor/doctor-profile'
              className={`nav-link ${location.pathname === '/doctor/doctor-profile' ? 'active' : ''
                }`}
            >
              <OverlayTrigger
                key={'DoctorProfile'}
                placement='right'
                overlay={<Tooltip id='DoctorProfile'>Doctor Profile</Tooltip>}
              >
                <i className='ri-profile-fill' />
              </OverlayTrigger>
              <span className='item-name'>Doctor Profile</span>
            </Link>
          </Nav.Item>
        )}

        <li>
          <hr className='hr-horizontal' />
        </li>

        <Accordion bsPrefix='bg-none' onSelect={(e) => setActiveMenu(e)}>
          <Nav.Item as='li' className='static-item ms-2'>
            <Nav.Link className='static-item disabled text-start' tabIndex='-1'>
              <span className='default-icon'>Apps</span>
              <span className='mini-icon'>-</span>
            </Nav.Link>
          </Nav.Item>



          {/* Medicine Module - Only show if user has permission */}
          {canAccessMedicineModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Medicine' && 'active'}`}
              onClick={() => setActive('Medicine')}
            >
              <div className='colors'>
                <CustomToggle
                  eventKey='Medicine'
                  activeClass={medicineItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={'Medicine'}
                    placement={'right'}
                    overlay={<Tooltip id='Medicine'>Medicine</Tooltip>}
                  >
                    <i className='ri-health-book-fill'></i>
                  </OverlayTrigger>
                  <span className='item-name'>Medicine</span>
                  <i className='right-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      className='icon-18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </i>
                </CustomToggle>

                <Accordion.Collapse
                  eventKey='Medicine'
                  as='ul'
                  className='sub-nav'
                  id='Medicine'
                >
                  <>
                    {medicineItems.map(({ path, name, icon, badge }) => (
                      <li key={path}>
                        <Link
                          className={`nav-link ${location.pathname === path ? 'active' : ''
                            }`}
                          to={path}
                        >
                          <i className={`icon ${icon}`}></i>
                          <span className='item-name'>{name}</span>
                          {badge && (
                            <span className={`badge ms-auto ${
                              badge === 'S3' ? 'bg-info' : 
                              badge === 'AI' ? 'bg-primary' : 
                              badge === 'NEW' ? 'bg-success' : 'bg-secondary'
                            }`}>
                              {badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          )}

          {/* Radiology Module - Only show if user has permission */}
          {canAccessRadiologyModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Radiology' && 'active'}`}
              onClick={() => setActive('Radiology')}
            >
              <div className='colors'>
                <CustomToggle
                  eventKey='Radiology'
                  activeClass={radiologyItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={'Radiology'}
                    placement={'right'}
                    overlay={<Tooltip id='Radiology'>Radiology</Tooltip>}
                  >
                    <i className='ri-microscope-fill'></i>
                  </OverlayTrigger>
                  <span className='item-name'>Radiology</span>
                  <i className='right-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      className='icon-18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </i>
                </CustomToggle>

                <Accordion.Collapse
                  eventKey='Radiology'
                  as='ul'
                  className='sub-nav'
                  id='Radiology'
                >
                  <>
                    {/* Core Dashboard */}
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/home' ? 'active' : ''}`}
                        to='/radiology/home'
                      >
                        <i className='icon ri-dashboard-3-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Dashboard</span>
                      </Link>
                    </li>

                    {/* AI-Powered Analysis Section */}
                    <li className="nav-divider">
                      <div className="radiology-nav-category">AI Analysis</div>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/analyze-report' ? 'active' : ''}`}
                        to='/radiology/analyze-report'
                      >
                        <i className='icon ri-ai-generate me-2'></i>
                        <span className='item-name flex-grow-1'>AI Report Analysis</span>
                        <span className='badge bg-primary ms-auto'>AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/advanced-rads-calculator' ? 'active' : ''}`}
                        to='/radiology/advanced-rads-calculator'
                      >
                        <i className='icon ri-brain-fill me-2'></i>
                        <span className='item-name flex-grow-1'>AI RADS Calculator</span>
                        <span className='badge bg-success ms-auto'>NEW</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/anonymize' ? 'active' : ''}`}
                        to='/radiology/anonymize'
                      >
                        <i className='icon ri-shield-user-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Document Anonymizer</span>
                      </Link>
                    </li>

                    {/* Clinical Tools Section */}
                    <li className="nav-divider">
                      <div className="radiology-nav-category">Clinical Tools</div>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/report-templates' ? 'active' : ''}`}
                        to='/radiology/report-templates'
                      >
                        <i className='icon ri-file-text-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Report Templates</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/voice-recognition' ? 'active' : ''}`}
                        to='/radiology/voice-recognition'
                      >
                        <i className='icon ri-mic-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Voice Recognition</span>
                        <span className='badge bg-primary ms-auto'>AI</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/clinical-reference' ? 'active' : ''}`}
                        to='/radiology/clinical-reference'
                      >
                        <i className='icon ri-book-open-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Clinical Reference</span>
                      </Link>
                    </li>

                    {/* Patient Management Section */}
                    <li className="nav-divider">
                      <div className="radiology-nav-category">Patient Management</div>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/patient-registry' ? 'active' : ''}`}
                        to='/radiology/patient-registry'
                      >
                        <i className='icon ri-user-heart-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Patient Registry</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/imaging-schedule' ? 'active' : ''}`}
                        to='/radiology/imaging-schedule'
                      >
                        <i className='icon ri-calendar-schedule-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Imaging Schedule</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/study-tracking' ? 'active' : ''}`}
                        to='/radiology/study-tracking'
                      >
                        <i className='icon ri-search-eye-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Study Tracking</span>
                      </Link>
                    </li>

                    {/* Data & History Section */}
                    <li className="nav-divider">
                      <div className="radiology-nav-category">Data & Archives</div>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/history' ? 'active' : ''}`}
                        to='/radiology/history'
                      >
                        <i className='icon ri-history-fill me-2'></i>
                        <span className='item-name flex-grow-1'>Report History</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link d-flex align-items-center ${location.pathname === '/radiology/data-manager' ? 'active' : ''}`}
                        to='/radiology/data-manager'
                      >
                        <i className='icon ri-database-2-fill me-2'></i>
                        <span className='item-name flex-grow-1'>S3 Data Manager</span>
                        <span className='badge bg-info ms-auto'>S3</span>
                      </Link>
                    </li>
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          )}

          {/* Dentistry Module - Only show if user has permission */}
          {canAccessDentistryModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Dentistry' && 'active'}`}
              onClick={() => setActive('Dentistry')}
            >
              <div className='colors'>
                <CustomToggle
                  eventKey='Dentistry'
                  activeClass={dentistryItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={'Dentistry'}
                    placement={'right'}
                    overlay={<Tooltip id='Dentistry'>Dentistry</Tooltip>}
                  >
                    <i className='ri-tooth-fill'></i>
                  </OverlayTrigger>
                  <span className='item-name'>Dentistry</span>
                  <i className='right-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      className='icon-18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </i>
                </CustomToggle>

                <Accordion.Collapse
                  eventKey='Dentistry'
                  as='ul'
                  className='sub-nav'
                  id='Dentistry'
                >
                  <>
                    {dentistryItems.map(({ path, name, icon }) => (
                      <li key={path}>
                        <Link
                          className={`nav-link ${location.pathname === path ? 'active' : ''
                            }`}
                          to={path}
                        >
                          <i className={`icon ${icon}`}></i>
                          <span className='item-name'>{name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          )}

          {/* Dermatology Module - Only show if user has permission */}
          {canAccessDermatologyModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Dermatology' && 'active'}`}
              onClick={() => setActive('Dermatology')}
            >
              <div className='colors'>
                <CustomToggle
                  eventKey='Dermatology'
                  activeClass={dermatologyItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={'Dermatology'}
                    placement={'right'}
                    overlay={<Tooltip id='Dermatology'>Dermatology</Tooltip>}
                  >
                    <i className='ri-heart-pulse-fill'></i>
                  </OverlayTrigger>
                  <span className='item-name'>Dermatology</span>
                  <i className='right-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      className='icon-18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </i>
                </CustomToggle>

                <Accordion.Collapse
                  eventKey='Dermatology'
                  as='ul'
                  className='sub-nav'
                  id='Dermatology'
                >
                  <>
                    {dermatologyItems.map(({ path, name, icon }) => (
                      <li key={path}>
                        <Link
                          className={`nav-link ${location.pathname === path ? 'active' : ''
                            }`}
                          to={path}
                        >
                          <i className={`icon ${icon}`}></i>
                          <span className='item-name'>{name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          )}

          {/* Pathology Module - Only show if user has permission */}
          {canAccessPathologyModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Pathology' && 'active'}`}
              onClick={() => setActive('Pathology')}
            >
              <div className='colors'>
                <CustomToggle
                  eventKey='Pathology'
                  activeClass={pathologyItems.some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={'Pathology'}
                    placement={'right'}
                    overlay={<Tooltip id='Pathology'>Pathology</Tooltip>}
                  >
                    <i className='ri-microscope-fill'></i>
                  </OverlayTrigger>
                  <span className='item-name'>Pathology</span>
                  <i className='right-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      className='icon-18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </i>
                </CustomToggle>

                <Accordion.Collapse
                  eventKey='Pathology'
                  as='ul'
                  className='sub-nav'
                  id='Pathology'
                >
                  <>
                    {pathologyItems.map(({ path, name, icon }) => (
                      <li key={path}>
                        <Link
                          className={`nav-link ${location.pathname === path ? 'active' : ''
                            }`}
                          to={path}
                        >
                          <i className={`icon ${icon}`}></i>
                          <span className='item-name'>{name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          )}

          {/* Homeopathy Module - Only show if user has permission */}
          {canAccessHomeopathyModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Homeopathy' && 'active'}`}
              onClick={() => setActive('Homeopathy')}
            >
            <div className='colors'>
              <CustomToggle
                eventKey='Homeopathy'
                activeClass={homeopathyItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={'Homeopathy'}
                  placement={'right'}
                  overlay={<Tooltip id='Homeopathy'>Homeopathy</Tooltip>}
                >
                  <i className='ri-leaf-fill'></i>
                </OverlayTrigger>
                <span className='item-name'>Homeopathy</span>
                <i className='right-icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    className='icon-18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </i>
              </CustomToggle>

              <Accordion.Collapse
                eventKey='Homeopathy'
                as='ul'
                className='sub-nav'
                id='Homeopathy'
              >
                <>
                  {homeopathyItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <Link
                        className={`nav-link ${location.pathname === path ? 'active' : ''
                          }`}
                        to={path}
                      >
                        <i className={`icon ${icon}`}></i>
                        <span className='item-name'>{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              </Accordion.Collapse>
            </div>
          </Accordion.Item>
          )}

          {/* Cosmetology Module - Only show if user has permission */}
          {canAccessCosmetologyModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Cosmetology' && 'active'}`}
              onClick={() => setActive('Cosmetology')}
            >
            <div className='colors'>
              <CustomToggle
                eventKey='Cosmetology'
                activeClass={cosmetologyItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={'Cosmetology'}
                  placement={'right'}
                  overlay={<Tooltip id='Cosmetology'>Cosmetology</Tooltip>}
                >
                  <i className='ri-brush-fill'></i>
                </OverlayTrigger>
                <span className='item-name'>Cosmetology</span>
                <span className="badge bg-success ms-1">New</span>
                <i className='right-icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    className='icon-18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </i>
              </CustomToggle>

              <Accordion.Collapse
                eventKey='Cosmetology'
                as='ul'
                className='sub-nav'
                id='Cosmetology'
              >
                <>
                  {cosmetologyItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <Link
                        className={`nav-link ${location.pathname === path ? 'active' : ''
                          }`}
                        to={path}
                      >
                        <i className={`icon ${icon}`}></i>
                        <span className='item-name'>{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              </Accordion.Collapse>
            </div>
            </Accordion.Item>
          )}

          {/* Allopathy Module - Only show if user has permission */}
          {canAccessAllopathyModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'Allopathy' && 'active'}`}
            onClick={() => setActive('Allopathy')}
          >
            <div className='colors'>
              <CustomToggle
                eventKey='Allopathy'
                activeClass={allopathyItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={'Allopathy'}
                  placement={'right'}
                  overlay={<Tooltip id='Allopathy'>Allopathy</Tooltip>}
                >
                  <i className='ri-stethoscope-fill'></i>
                </OverlayTrigger>
                <span className='item-name'>Allopathy</span>
                <i className='right-icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    className='icon-18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </i>
              </CustomToggle>

              <Accordion.Collapse
                eventKey='Allopathy'
                as='ul'
                className='sub-nav'
                id='Allopathy'
              >
                <>
                  {allopathyItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <Link
                        className={`nav-link ${location.pathname === path ? 'active' : ''
                          }`}
                        to={path}
                      >
                        <i className={`icon ${icon}`}></i>
                        <span className='item-name'>{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              </Accordion.Collapse>
            </div>
          </Accordion.Item>
          )}

          {/* DNA Sequencing Module - Only show if user has permission */}
          {canAccessDnaSequencingModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'DNASequencing' && 'active'}`}
              onClick={() => setActive('DNASequencing')}
            >
            <div className='colors'>
              <CustomToggle
                eventKey='DNASequencing'
                activeClass={dnaSequencingItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={'DNASequencing'}
                  placement={'right'}
                  overlay={<Tooltip id='DNASequencing'>DNA Sequencing</Tooltip>}
                >
                  <i className='ri-test-tube-fill'></i>
                </OverlayTrigger>
                <span className='item-name'>DNA Sequencing</span>
                <i className='right-icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    className='icon-18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </i>
              </CustomToggle>

              <Accordion.Collapse
                eventKey='DNASequencing'
                as='ul'
                className='sub-nav'
                id='DNASequencing'
              >
                <>
                  {dnaSequencingItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <Link
                        className={`nav-link ${location.pathname === path ? 'active' : ''
                          }`}
                        to={path}
                      >
                        <i className={`icon ${icon}`}></i>
                        <span className='item-name'>{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              </Accordion.Collapse>
            </div>
          </Accordion.Item>
          )}

          {/* SecureNeat Module - Only show if user has permission */}
          {canAccessSecureneatModule() && (
            <Accordion.Item
              as='li'
              className={`nav-item ${active === 'SecureNeat' && 'active'}`}
              onClick={() => setActive('SecureNeat')}
            >
            <div className='colors'>
              <CustomToggle
                eventKey='SecureNeat'
                activeClass={SecureNeatItems.some(
                  (item) => location.pathname === item.path
                )}
                onClick={(activeKey) => setActiveMenu(activeKey)}
              >
                <OverlayTrigger
                  key={'SecureNeat'}
                  placement={'right'}
                  overlay={<Tooltip id='SecureNeat'>SecureNeat</Tooltip>}
                >
                  <i className='ri-mail-open-fill'></i>
                </OverlayTrigger>
                <span className='item-name'>SecureNeat</span>
                <i className='right-icon'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    className='icon-18'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </i>
              </CustomToggle>

              <Accordion.Collapse
                eventKey='SecureNeat'
                as='ul'
                className='sub-nav'
                id='SecureNeat'
              >
                <>
                  {SecureNeatItems.map(({ path, name, icon }) => (
                    <li key={path}>
                      <Link
                        className={`nav-link ${location.pathname === path ? 'active' : ''
                          }`}
                        to={path}
                      >
                        <i className={`icon ${icon}`}></i>
                        <span className='item-name'>{name}</span>
                      </Link>
                    </li>
                  ))}
                </>
              </Accordion.Collapse>
            </div>
          </Accordion.Item>
          )}

          <li className={`nav-item ${active === 'Admin' && 'active'}`}>
            <Accordion.Item
              onClick={() => setActive('Admin')}
            >
              <div className='colors'>
                <CustomToggle
                  eventKey='Admin'
                  activeClass={getFilteredAdminItems().some(
                    (item) => location.pathname === item.path
                  )}
                  onClick={(activeKey) => setActiveMenu(activeKey)}
                >
                  <OverlayTrigger
                    key={'Admin'}
                    placement={'right'}
                    overlay={<Tooltip id='Admin'>Admin Management</Tooltip>}
                  >
                    <i className='ri-shield-user-fill'></i>
                  </OverlayTrigger>
                  <span className='item-name'>Admin Management</span>
                  <i className='right-icon'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='18'
                      className='icon-18'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </i>
                </CustomToggle>

                <Accordion.Collapse eventKey='Admin' as='ul' className='sub-nav'>
                  <>
                    {getFilteredAdminItems().map((item, index) => (
                      <li
                        key={index}
                        className={
                          location.pathname === item.path ? 'active' : ''
                        }
                      >
                        <Link to={item.path} className='nav-link'>
                          <OverlayTrigger
                            key={item.name}
                            placement='right'
                            overlay={<Tooltip id={item.name}>{item.name}</Tooltip>}
                          >
                            <i className={item.icon}></i>
                          </OverlayTrigger>
                          <span className='item-name'>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </>
                </Accordion.Collapse>
              </div>
            </Accordion.Item>
          </li>
        </Accordion>

        <Nav.Item as='li'>
          <Link
            to='/mastermind-subscription'
            className={`nav-link ${location.pathname === '/mastermind-subscription' ? 'active' : ''
              }`}
          >
            <OverlayTrigger
              key={'Subscriptions'}
              placement='right'
              overlay={<Tooltip id='Subscriptions'>Subscriptions</Tooltip>}
            >
              <i className='ri-money-dollar-circle-fill' />
            </OverlayTrigger>
            <span className='item-name'>Subscriptions</span>
          </Link>
        </Nav.Item>

        <li>
          <hr className='hr-horizontal' />
        </li>
      </ul>
    </>
  );
};

export default VerticalNav;
