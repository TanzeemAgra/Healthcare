import ProtectedRoute from './ProtectedRoute';
import PermissionWrapper from '../components/PermissionWrapper';
import { Navigate } from 'react-router-dom';

import DefaultLayout from '../layouts/defaultLayout';
import Index from '../views';
import LandingPage from '../views/LandingPage';
import EnhancedLandingPage from '../components/EnhancedLandingPage';

// Dashboard Page
import MainDashboard from '../views/dashboard-pages/MainDashboard';
import HospitalDashboardOne from '../views/dashboard-pages/hospital-dashboard-one';
import SuperAdminHospitalDashboard from '../views/dashboard-pages/SuperAdminHospitalDashboard';
import AdvancedHospitalManagement from '../views/dashboard-pages/AdvancedHospitalManagement';
import AdvancedClinicManagement from '../views/dashboard-pages/AdvancedClinicManagement';
import AIHospitalDashboard from '../views/dashboard-pages/AIHospitalDashboard';
import PatientDashboard from '../views/dashboard-pages/patient-dashboard';
import ReliablePatientDashboard from '../views/dashboard-pages/ReliablePatientDashboard';
import Covid19Dashboard from '../views/dashboard-pages/covid-19-dashboard';

// Secureneat
import SecureNeatDashboard from '../views/secureneat/dashboard';
import NewSecureNeatDashboard from '../views/secureneat/NewDashboard';
import NewSecureNeatChatbot from '../views/secureneat/NewChatbot';
import NewSecureNeatMCQ from '../views/secureneat/EnhancedMCQ';
import NewSecureNeatOSCE from '../views/secureneat/NewOSCE';
import DrMaxBot from '../views/secureneat/chatbot';
import SecureNeatProfile from '../views/secureneat/profile';
import McqPractice from '../views/secureneat/mcq';
import OsceScenario from '../views/secureneat/OSCE';

// subscribtions
import SubscriptionPage from '../views/subscription/subscription';
import ModernSubscriptionPage from '../views/subscription/ModernSubscription';
import NetflixStyleSubscription from '../views/subscription/NetflixStyleSubscription';
import PaymentSuccess from '../views/subscription/PaymentSuccess';
import Checkout from '../views/subscription/Checkout';
import AdminSubscriptionDashboard from '../views/subscription/AdminSubscriptionDashboard';
import ManualBillingLandingPage from '../views/subscription/ManualBillingLandingPage';

// Admin Management Components
import AdminDashboard from '../views/admin/AdminDashboard';
import UserManagement from '../views/user-management/UserManagementSimple';
import EnhancedUserManagement from '../views/user-management/EnhancedUserManagement';
import SimpleAdminCreation from '../views/user-management/SimpleAdminCreation';
import UserManagementRoutes from '../views/user-management/UserManagementRoutes';
import PermissionDashboard from '../views/permissions/PermissionDashboard';
import SystemSettings from '../views/admin/SystemSettings';
import SystemLogs from '../views/admin/SystemLogs';
import AccessTest from '../views/admin/AccessTest';
import StaffManagement from '../views/admin/StaffManagement';
import AdminDashboardRouter from './adminDashboardRouter';

// Auth Components
// Unified Login system imports
import Login from '../views/auth/Login';
import AuthReset from '../components/AuthReset';
import ProfileRouter from '../components/ProfileRouter';

//radiology
import RadiologyHome from '../views/radiology/RadiologyHome';
import AnalyzeReport from '../views/radiology/AnalyzeReport';
import AnonymizeDocument from '../views/radiology/AnonymizeDocument';
import ReportHistory from '../views/radiology/ReportHistory';
import ReportTemplate from '../views/radiology/ReportTemplate';
import AdvancedRADSCalculator from '../views/radiology/AdvancedRADSCalculator';
import ClinicalReference from '../views/radiology/ClinicalReference';
import ReportCorrection from '../views/radiology/ReportCorrection';
import AdvancedReportCorrection from '../views/radiology/AdvancedReportCorrection';
import AdvancedAnalyzeReport from '../views/radiology/AdvancedAnalyzeReport';
import PatientRegistry from '../views/radiology/PatientRegistry';
import ImagingSchedule from '../views/radiology/ImagingSchedule';
import StudyTracking from '../views/radiology/StudyTracking';
import RadiologyDataManager from '../views/radiology/RadiologyDataManager';
import RadiologySecureS3Page from '../views/radiology/RadiologySecureS3Page';
import VoiceRecognitionTools from '../views/radiology/VoiceRecognitionTools';

// Dentistry Components
import DentistryDashboard from '../components/dentistry/DentistryDashboard';
import DentistryPatients from '../components/dentistry/DentistryPatients';
import DentistryAppointments from '../components/dentistry/DentistryAppointments';
import DentistryTreatments from '../components/dentistry/DentistryTreatments';
import DentistryAIAnalysis from '../components/dentistry/DentistryAIAnalysis';
import DentistryEmergencies from '../components/dentistry/DentistryEmergencies';
import DentistryS3DataManager from '../views/dentistry/DentistryS3DataManager';
import DentistrySecureS3Page from '../views/dentistry/DentistrySecureS3Page';

// Dermatology Components
import DermatologyDashboard from '../components/dermatology/DermatologyDashboard';
import DermatologyPatients from '../components/dermatology/DermatologyPatients';
import DermatologyConsultations from '../components/dermatology/DermatologyConsultations';
import DermatologyConditions from '../components/dermatology/DermatologyConditions';
import DermatologyAIAnalysis from '../components/dermatology/DermatologyAIAnalysis';
import DermatologyTreatmentPlans from '../components/dermatology/DermatologyTreatmentPlans';
import DermatologyS3DataManager from '../views/dermatology/DermatologyS3DataManager';
import DermatologySecureS3Page from '../views/dermatology/DermatologySecureS3Page';

// Cosmetology Components - SOFT CODING SOLUTION
// Using robust import system with fallback mechanisms
import { CosmetologyComponents, SafeComponent } from './cosmetologyRouter.jsx';
import { createFallbackComponent } from '../utils/componentFactory.jsx';

// Fallback import for backward compatibility
let CosmetologyClients, CosmetologyServices, CosmetologyAppointments, CosmetologyTreatments, CosmetologyProducts;
// Legacy imports kept for backward compatibility - replaced by soft-coded system
// import CosmetologyConsultations from '../components/cosmetology/CosmetologyConsultations';
import CosmeticGynecologyDashboard from '../components/cosmetology/CosmeticGynecologyDashboard';

// Pathology Components
import PathologyDashboard from '../views/pathology/PathologyDashboard';
import PathologyDepartments from '../views/pathology/PathologyDepartments';
import PathologyReports from '../views/pathology/PathologyReports';
import PathologyOrders from '../views/pathology/PathologyOrders';
import PathologySpecimens from '../views/pathology/PathologySpecimens';
import PathologyAnalytics from '../views/pathology/PathologyAnalytics';
import PathologyTests from '../views/pathology/PathologyTests';
import PathologyS3DataManager from '../views/pathology/PathologyS3DataManager';
import PathologySecureS3Page from '../views/pathology/PathologySecureS3Page';
import HomeopathyS3DataManager from '../components/HomeopathyS3DataManager';

// Homeopathy Components
import HomeopathyDashboard from '../components/homeopathy/HomeopathyDashboard';
import HomeopathyCaseTaking from '../components/homeopathy/HomeopathyCaseTaking';
import HomeopathyRepertorization from '../components/homeopathy/HomeopathyRepertorization';
import HomeopathyRemedyDatabase from '../components/homeopathy/HomeopathyRemedyDatabase';
import HomeopathyPatients from '../components/homeopathy/HomeopathyPatients';
import HomeopathyPrescriptions from '../components/homeopathy/HomeopathyPrescriptions';
import HomeopathyDiagnosis from '../components/homeopathy/HomeopathyDiagnosis';

// Allopathy Components
import AllopathyModule from '../views/medical-specialties/AllopathyModule';
import AllopathyDashboard from '../views/medical-specialties/AllopathyDashboard';
import AllopathyDiagnosisAI from '../views/medical-specialties/AllopathyDiagnosisAI';
import AllopathyDrugChecker from '../views/medical-specialties/AllopathyDrugChecker';
import AllopathyClinicalNotes from '../views/medical-specialties/AllopathyClinicalNotes';
// Import S3 Data Management System
import AllopathyS3Dashboard from '../components/allopathy/AllopathyDashboardSimple';
import ProtectedAllopathyS3DataManager from '../views/allopathy/AllopathyS3DataManagerPage';
import AllopathySecureS3Page from '../views/allopathy/AllopathySecureS3Page';
import HomeopathySecureS3Page from '../views/homeopathy/HomeopathySecureS3Page';
import CosmetologySecureS3Page from '../views/cosmetology/CosmetologySecureS3Page';

// DNA Sequencing Components
import DNASequencingDashboard from '../views/dna-sequencing/DNASequencingDashboard';
import GenomeAnalysis from '../views/dna-sequencing/GenomeAnalysis';
import SampleManagement from '../views/dna-sequencing/SampleManagement';
import VariantCalling from '../views/dna-sequencing/VariantCalling';
import QualityControl from '../views/dna-sequencing/QualityControl';
import Reports from '../views/dna-sequencing/Reports';
import AIGenomicsLab from '../views/dna-sequencing/AIGenomicsLab';
import ProtectedS3DataManager from '../views/dna-sequencing/S3DataManagerPage';

// NeatSecure S3 Data Manager
import ProtectedNeatSecureS3DataManager from '../views/secureneat/NeatSecureS3DataManagerPage';

import PermissionTestPage from '../views/test/PermissionTestPage';
import IconTest from '../views/test/IconTest';

// Medicine Components
import MedicineDashboard from '../views/medicine/MedicineDashboard';
import MedicineAdvancedManagement from '../views/medicine/MedicineAdvancedManagement';
import GeneralMedicine from '../views/medicine/GeneralMedicine';
import EmergencyMedicine from '../views/medicine/EmergencyMedicine';
import DiabetesPatientTracker from '../views/medicine/DiabetesPatientTracker';
import DiabeticRetinopathy from '../views/medicine/DiabeticRetinopathy';
import MedicineS3DataManager from '../views/medicine/MedicineS3DataManager';
import MedicineSecureS3Page from '../views/medicine/MedicineSecureS3Page';

// Patient Management Components
import PatientManagement from '../views/patients/PatientManagement';
import PatientDashboardMain from '../views/patients/PatientDashboard';

// Email Page
import Inbox from '../views/email/inbox';
import EmailCompose from '../views/email/email-compose';

// Doctor Page
import AddDoctor from '../views/doctor/add-doctor';
import DoctorList from '../views/doctor/doctor-list';
import EnhancedDoctorProfile from '../views/doctor/EnhancedDoctorProfile';
import EditDoctor from '../views/doctor/edit-doctor';
import EnhancedEditDoctorProfile from '../components/doctor/EnhancedEditDoctorProfile';
import EditProfileValidator from '../components/validation/EditProfileValidator';
import DoctorEditRouter from '../components/doctor/DoctorEditRouter';
import MyDoctorProfile from '../components/doctor/MyDoctorProfile';

// Calendar Page
import Calendar from '../views/calendar/calendar';

// Chat Page
import Chat from '../views/chat/chat';

// UI Elements
import Alerts from '../views/ui-elements/alerts';
import Badges from '../views/ui-elements/badges';
import Breadcrumb from '../views/ui-elements/breadcrumb';
import Buttons from '../views/ui-elements/buttons';
import Cards from '../views/ui-elements/cards';
import Carousels from '../views/ui-elements/carousel';
import Colors from '../views/ui-elements/colors';
import Grid from '../views/ui-elements/grid';
import Images from '../views/ui-elements/images';
import ListGroups from '../views/ui-elements/listGroup';
import Modals from '../views/ui-elements/modal';
import Notification from '../views/ui-elements/notification';
import Paginations from '../views/ui-elements/pagination';
import Popovers from '../views/ui-elements/popovers';
import Progressbars from '../views/ui-elements/progressbars';
import Tabs from '../views/ui-elements/tabs';
import Tooltips from '../views/ui-elements/tooltips';
import Typography from '../views/ui-elements/typography';
import Video from '../views/ui-elements/video';

// Form Page
import FormCheckbox from '../views/forms/form-checkbox';
import FormElements from '../views/forms/form-elements';
import FormRadio from '../views/forms/form-radio';
import FormSwitch from '../views/forms/form-switch';
import FormValidatioins from '../views/forms/form-validations';

// Wizard Page
import SimpalWizard from '../views/wizard/simple-wizard';
import ValidteWizard from '../views/wizard/validate-wizard';
import VerticalWizard from '../views/wizard/vertical-wizard';

// Table Page
import BasicTable from '../views/tables/basic-table';
import DataTable from '../views/tables/data-table';
import EditTable from '../views/tables/editable-table';

// Charts Page
import ApexChart from '../views/charts/apex-chart';
import ChartAm from '../views/charts/chart-am';
import ChartPage from '../views/charts/chart-page';
import EChart from '../views/charts/e-chart';

// Icons Page
import Dripicons from '../views/icons/dripicons';
import FontAwsomeFive from '../views/icons/fontawesome-Five';
import Lineawesome from '../views/icons/line-awesome';
import Remixicon from '../views/icons/remixicon';
import Unicons from '../views/icons/unicons';

// Maps
import GoogleMap from '../views/maps/google-map';

// Extra Page
import AccountSetting from '../views/extra-pages/account-setting';
import BlankPage from '../views/extra-pages/blank-page';
import CommingSoon from '../views/extra-pages/pages-comingsoon';
import Error404 from '../views/extra-pages/pages-error-404';
import Error500 from '../views/extra-pages/pages-error-500';
import Faq from '../views/extra-pages/pages-faq';
import Invoice from '../views/extra-pages/pages-invoice';
import Maintenance from '../views/extra-pages/pages-maintenance';
import PricingOne from '../views/extra-pages/pages-pricing-one';
import Pricing from '../views/extra-pages/pages-pricing';
import Timeline from '../views/extra-pages/pages-timeline';
import PrivacyPolicy from '../views/extra-pages/privacy-policy';
import PrivacySimple from '../views/extra-pages/privacy-simple';
import PrivacyPolicyFull from '../views/extra-pages/privacy-policy-full';
import PrivacySetting from '../views/extra-pages/privacy-setting';
import TermsOfService from '../views/extra-pages/terms-of-service';
import BlankLayout from '../layouts/blank-layout';
// Unified Login - removed unused sign-in imports
// import SignIn from '../views/auth/sign-in';
// import ModernSignIn from '../views/auth/ModernSignIn';
import ConformMail from '../views/auth/confirm-mail';
import SignUp from '../views/auth/sign-up';
import ModernSignUp from '../views/auth/ModernSignUp';
import WorkingModernSignUp from '../views/auth/WorkingModernSignUp';
import SimpleModernSignUp from '../views/auth/SimpleModernSignUp';
import RecoverPassword from '../views/auth/recover-password';
import Registration from '../views/auth/Registration';
import LockScreen from '../views/auth/lock-screen';
import Contact from '../views/contact/Contact';
import HealthcareModulesOverview from '../views/HealthcareModulesOverview';

export const DefaultRoute = [
  // Public landing page route (no authentication required)
  {
    path: '/',
    element: import.meta.env.VITE_USE_ENHANCED_LANDING === 'true' ? <EnhancedLandingPage /> : <LandingPage />,
  },
  // Enhanced landing page route (direct access)
  {
    path: '/enhanced',
    element: <EnhancedLandingPage />,
  },
  // Login redirect for convenience
  {
    path: '/login',
    element: <Login />,
  },
  // Auth reset utility
  {
    path: '/auth-reset',
    element: <AuthReset />,
  },
  // Legacy login route
  {
    path: '/modern-signin',
    element: <Login />,
  },
  // Sign up redirect for convenience
  {
    path: '/signup',
    element: <SignUp />,
  },
  // Modern sign up page
  {
    path: '/modern-signup',
    element: <WorkingModernSignUp />,
  },
  // Primary subscription selection page for users
  {
    path: '/subscription',
    element: <NetflixStyleSubscription />,
  },
  // Monthly subscription page with flexible pricing model
  {
    path: '/billing/subscriptions',
    element: <ManualBillingLandingPage />,
  },
  // Contact page
  {
    path: '/contact',
    element: <Contact />,
  },
  // Profile route - dynamically redirects based on user role
  {
    path: '/profile',
    element: <ProfileRouter />,
  },
  // Healthcare modules overview page
  {
    path: '/healthcare-modules',
    element: <HealthcareModulesOverview />,
  },
  // Legacy subscription URL redirect for backward compatibility
  {
    path: '/subscription-old',
    element: <Navigate to="/subscription" replace />,
  },
  // Demo redirects - redirect all demo pages to contact
  {
    path: '/medicine/demo',
    element: <Navigate to="/contact" replace />,
  },
  // Public Medicine S3 Data Manager Demo (no authentication required)
  {
    path: '/medicine/s3-data-manager-demo',
    element: <MedicineSecureS3Page />,
  },
  {
    path: '/dermatology/demo',
    element: <Navigate to="/contact" replace />,
  },
  {
    path: '/radiology/demo',
    element: <Navigate to="/contact" replace />,
  },
  {
    path: '/dentistry/demo',
    element: <Navigate to="/contact" replace />,
  },
  {
    path: '/pathology/demo',
    element: <Navigate to="/contact" replace />,
  },
  {
    path: '/secureneat/demo',
    element: <Navigate to="/contact" replace />,
  },
  {
    path: '/demo',
    element: <Navigate to="/contact" replace />,
  },
  // Privacy policy redirect for convenience
  {
    path: '/privacy',
    element: <Navigate to="/extra-pages/privacy-policy" replace />,
  },
  // Public checkout route (no authentication required)
  {
    path: '/checkout',
    element: <Checkout />,
  },
  // Public payment success route (no authentication required)
  {
    path: '/subscription/payment-success',
    element: <PaymentSuccess />,
  },
  // PUBLIC TEST: Direct radiology access without any protection
  {
    path: '/test-radiology-public',
    element: <AnalyzeReport />,
  },
  // PUBLIC DEBUG: Authentication debug component
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DefaultLayout />,
        children: [
          //  ------ Subscription & Dashboard Routes ------
          {
            path: '/subscription/manage',
            element: <ModernSubscriptionPage />,
          },
          {
            path: '/admin/subscriptions',
            element: <ModernSubscriptionPage />,
          },
          // Admin subscription tracking - Administrator access only
          {
            path: '/mastermind-subscription',
            element: <AdminSubscriptionDashboard />,
          },
          
          //  ------ Admin Management Routes (Protected) - ENHANCED WITH SOFT CODING ------
          {
            path: '/admin/*',
            element: <AdminDashboardRouter />,
          },
          
          // Legacy admin routes for backwards compatibility
          {
            path: '/admin-dashboard',
            element: <Navigate to="/admin/dashboard" replace />,
          },
          {
            path: '/admin/user-management-full',
            element: <EnhancedUserManagement />,
          },
          {
            path: '/admin/users', // Legacy route for backwards compatibility
            element: <SimpleAdminCreation />,
          },
          {
            path: '/user-management/*',
            element: <UserManagementRoutes />,
          },
          {
            path: '/admin/staff-management',
            element: <StaffManagement />,
          },
          {
            path: '/admin/analytics',
            element: <AdminDashboard />, // For now, redirect to dashboard
          },
          {
            path: '/admin/system-settings',
            element: <SystemSettings />,
          },
          {
            path: '/admin/security',
            element: <SystemSettings />, // For now, redirect to system settings
          },
          {
            path: '/admin/notifications',
            element: <AdminDashboard />, // For now, redirect to dashboard
          },
          {
            path: '/admin/backup',
            element: <SystemSettings />, // For now, redirect to system settings
          },
          {
            path: '/admin/logs',
            element: (
              <PermissionWrapper requiredPermission="user_management">
                <SystemLogs />
              </PermissionWrapper>
            ),
          },
          {
            path: '/admin/access-test',
            element: (
              <PermissionWrapper requiredPermission="user_management">
                <AccessTest />
              </PermissionWrapper>
            ),
          },
          
          {
            path: '/subscription/legacy',
            element: <SubscriptionPage />,
          },

          //  ------ Main Dashboard Routes ------
          {
            path: '/dashboard',
            element: <MainDashboard />,
          },
          {
            path: '/dashboard-pages/dashboard-1',
            element: (
              <PermissionWrapper requiredPermission="hospital_management">
                <HospitalDashboardOne />
              </PermissionWrapper>
            ),
          },
          {
            path: '/dashboard-pages/dashboard-1-original',
            element: <HospitalDashboardOne />,
          },
          {
            path: '/dashboard-pages/dashboard-1-simple',
            element: <SuperAdminHospitalDashboard />,
          },
          {
            path: '/dashboard-pages/dashboard-2',
            element: (
              <PermissionWrapper requiredPermission="clinic_management">
                <AdvancedClinicManagement />
              </PermissionWrapper>
            ),
          },
          {
            path: '/dashboard-pages/patient-dashboard',
            element: (
              <PermissionWrapper requiredPermission="patient_management">
                <ReliablePatientDashboard />
              </PermissionWrapper>
            ),
          },
          {
            path: '/dashboard-pages/dashboard-4',
            element: <Covid19Dashboard />,
          },

          //  ------ Email Route ------
          {
            path: '/email/inbox',
            element: <Inbox />,
          },
          {
            path: '/email/email-compose',
            element: <EmailCompose />,
          },

          //  ------ Doctor Route ------
          {
            path: '/doctor/doctor-list',
            element: <DoctorList />,
          },
          {
            path: '/doctor/add-doctor',
            element: <AddDoctor />,
          },
          {
            path: '/doctor/doctor-profile',
            element: <EnhancedDoctorProfile />,
          },
          {
            path: '/doctor/edit-doctor',
            element: <DoctorEditRouter />,
          },
          {
            path: '/doctor/edit-doctor/:id',
            element: <EditDoctor />,
          },
          {
            path: '/doctor/edit-profile',
            element: <EnhancedEditDoctorProfile />,
          },
          {
            path: '/doctor/my-profile',
            element: <MyDoctorProfile />,
          },
          {
            path: '/doctor/validate-edit-profile',
            element: <EditProfileValidator />,
          },

          //  ------ SecureNeat Route (New Clean Version) ------
          {
            path: '/SecureNeat/dashboard',
            element: <NewSecureNeatDashboard />,
          },
          {
            path: '/SecureNeat/chat',
            element: <DrMaxBot />,
          },
          // Legacy routes for backward compatibility
          {
            path: '/SecureNeat/dashboard-old',
            element: <SecureNeatDashboard />,
          },
          {
            path: '/SecureNeat/chat-old',
            element: <NewSecureNeatChatbot />,
          },
          {
            path: '/SecureNeat/mcq-practice',
            element: <NewSecureNeatMCQ />,
          },
          {
            path: '/SecureNeat/osce-scenario',
            element: <NewSecureNeatOSCE />,
          },
          // Legacy MCQ route
          {
            path: '/SecureNeat/mcq-practice-old',
            element: <McqPractice />,
          },
          // Legacy OSCE route
          {
            path: '/SecureNeat/osce-scenario-old',
            element: <OsceScenario />,
          },
          {
            path: '/SecureNeat/profile',
            element: <SecureNeatProfile />,
          },
          {
            path: '/SecureNeat/s3-data-manager',
            element: <ProtectedNeatSecureS3DataManager />,
          },

          //  ------ Medicine Route ------
          {
            path: '/medicine/dashboard',
            element: <MedicineDashboard />,
          },
          {
            path: '/medicine/management',
            element: <MedicineAdvancedManagement />,
          },
          {
            path: '/medicine/s3-data-manager',
            element: <MedicineS3DataManager />,
          },
          {
            path: '/medicine/secure-s3-manager',
            element: <MedicineSecureS3Page />,
          },
          {
            path: '/medicine/general',
            element: <GeneralMedicine />,
          },
          {
            path: '/medicine/emergency',
            element: <EmergencyMedicine />,
          },
          {
            path: '/medicine/diabetes-tracker',
            element: <DiabetesPatientTracker />,
          },
          {
            path: '/medicine/diabetic-retinopathy',
            element: <DiabeticRetinopathy />,
          },

          //  ------ Patient Management Route ------
          {
            path: '/patients/dashboard',
            element: <PatientDashboardMain />,
          },
          {
            path: '/patients/manage',
            element: <PatientManagement />,
          },

          //  ------ Radiology Route ------
          {
            path: '/radiology/home',
            element: <RadiologyHome />,
          },
          {
            path: '/radiology/advanced-report-correction',
            element: <AdvancedReportCorrection />,
          },
          {
            path: '/radiology/analyze-report',
            element: <AdvancedAnalyzeReport />,
          },
          {
            path: '/radiology/anonymize',
            element: <AnonymizeDocument />,
          },
          {
            path: '/radiology/history',
            element: <ReportHistory />,
          },
          {
            path: '/radiology/report-templates',
            element: <ReportTemplate />,
          },
          {
            path: '/radiology/voice-recognition',
            element: <VoiceRecognitionTools />,
          },
          {
            path: '/radiology/advanced-rads-calculator',
            element: <AdvancedRADSCalculator />,
          },
          {
            path: '/radiology/clinical-reference',
            element: <ClinicalReference />,
          },
          {
            path: '/radiology/report-correction',
            element: <ReportCorrection />,
          },
          {
            path: '/radiology/patient-registry',
            element: <PatientRegistry />,
          },
          {
            path: '/radiology/imaging-schedule',
            element: <ImagingSchedule />,
          },
          {
            path: '/radiology/study-tracking',
            element: <StudyTracking />,
          },
          {
            path: '/radiology/data-manager',
            element: <RadiologyDataManager />,
          },
          {
            path: '/radiology/secure-s3-manager',
            element: <RadiologySecureS3Page />,
          },

          //  ------ Dentistry Route ------
          {
            path: '/dentistry',
            element: <Navigate to="/dentistry/s3-manager" replace />,
          },
          {
            path: '/dentistry/s3-manager',
            element: <DentistryS3DataManager />,
          },
          {
            path: '/dentistry/secure-s3-manager',
            element: <DentistrySecureS3Page />,
          },
          {
            path: '/dentistry/dashboard',
            element: <DentistryDashboard />,
          },
          {
            path: '/dentistry/patients',
            element: <DentistryPatients />,
          },
          {
            path: '/dentistry/appointments',
            element: <DentistryAppointments />,
          },
          {
            path: '/dentistry/treatments',
            element: <DentistryTreatments />,
          },
          {
            path: '/dentistry/ai-analysis',
            element: <DentistryAIAnalysis />,
          },
          {
            path: '/dentistry/emergencies',
            element: <DentistryEmergencies />,
          },

          //  ------ Dermatology Route ------
          {
            path: '/dermatology',
            element: <Navigate to="/dermatology/s3-manager" replace />,
          },
          {
            path: '/dermatology/s3-manager',
            element: <DermatologyS3DataManager />,
          },
          {
            path: '/dermatology/secure-s3-manager',
            element: <DermatologySecureS3Page />,
          },
          {
            path: '/dermatology/dashboard',
            element: <DermatologyDashboard />,
          },
          {
            path: '/dermatology/patients',
            element: <DermatologyPatients />,
          },
          {
            path: '/dermatology/consultations',
            element: <DermatologyConsultations />,
          },
          {
            path: '/dermatology/skin-conditions',
            element: <DermatologyConditions />,
          },
          {
            path: '/dermatology/ai-analysis',
            element: <DermatologyAIAnalysis />,
          },
          {
            path: '/dermatology/treatment-plans',
            element: <DermatologyTreatmentPlans />,
          },

          //  ------ Cosmetology Route ------
          {
            path: '/cosmetology',
            element: <Navigate to="/cosmetology/dashboard" replace />,
          },
          {
            path: '/cosmetology/dashboard',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyDashboard} componentName="CosmetologyDashboard" />,
          },
          {
            path: '/cosmetology/s3-manager',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyS3DataManager} componentName="CosmetologyS3DataManager" />,
          },
          {
            path: '/cosmetology/secure-s3-manager',
            element: <CosmetologySecureS3Page />,
          },
          {
            path: '/cosmetology/clients',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyClients} componentName="CosmetologyClients" />,
          },
          {
            path: '/cosmetology/services',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyServices} componentName="CosmetologyServices" />,
          },
          {
            path: '/cosmetology/appointments',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyAppointments} componentName="CosmetologyAppointments" />,
          },
          {
            path: '/cosmetology/treatments',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyTreatments} componentName="CosmetologyTreatments" />,
          },
          {
            path: '/cosmetology/products',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyProducts} componentName="CosmetologyProducts" />,
          },
          {
            path: '/cosmetology/consultations',
            element: <SafeComponent component={CosmetologyComponents.CosmetologyConsultations} componentName="CosmetologyConsultations" />,
          },
          {
            path: '/cosmetology/gynecology',
            element: <CosmeticGynecologyDashboard />,
          },

          //  ------ Pathology Route ------
          {
            path: '/pathology',
            element: <Navigate to="/pathology/s3-manager" replace />,
          },
          {
            path: '/pathology/s3-manager',
            element: <PathologyS3DataManager />,
          },
          {
            path: '/pathology/secure-s3-manager',
            element: <PathologySecureS3Page />,
          },
          {
            path: '/pathology/dashboard',
            element: <PathologyDashboard />,
          },
          {
            path: '/pathology/departments',
            element: <PathologyDepartments />,
          },
          {
            path: '/pathology/orders',
            element: <PathologyOrders />,
          },
          {
            path: '/pathology/reports',
            element: <PathologyReports />,
          },
          {
            path: '/pathology/specimens',
            element: <PathologySpecimens />,
          },
          {
            path: '/pathology/analytics',
            element: <PathologyAnalytics />,
          },
          {
            path: '/pathology/tests',
            element: <PathologyTests />,
          },

          //  ------ Homeopathy Route ------
          {
            path: '/homeopathy',
            element: <Navigate to="/homeopathy/s3-manager" replace />,
          },
          {
            path: '/homeopathy/s3-manager',
            element: <HomeopathyS3DataManager />,
          },
          {
            path: '/homeopathy/secure-s3-manager',
            element: <HomeopathySecureS3Page />,
          },
          {
            path: '/homeopathy/dashboard',
            element: <HomeopathyDashboard />,
          },
          {
            path: '/homeopathy/diagnosis',
            element: <HomeopathyDiagnosis />,
          },
          {
            path: '/homeopathy/case-taking',
            element: <HomeopathyCaseTaking />,
          },
          {
            path: '/homeopathy/repertorization',
            element: <HomeopathyRepertorization />,
          },
          {
            path: '/homeopathy/remedy-database',
            element: <HomeopathyRemedyDatabase />,
          },
          {
            path: '/homeopathy/patients',
            element: <HomeopathyPatients />,
          },
          {
            path: '/homeopathy/prescriptions',
            element: <HomeopathyPrescriptions />,
          },

          //  ------ Allopathy Route ------
          {
            path: '/allopathy',
            element: <AllopathyModule />,
          },
          {
            path: '/allopathy/dashboard',
            element: <AllopathyDashboard />,
          },
          {
            path: '/allopathy/data-management',
            element: <AllopathyS3Dashboard />,
          },
          {
            path: '/allopathy/diagnosis',
            element: <AllopathyDiagnosisAI />,
          },
          {
            path: '/allopathy/drug-checker',
            element: <AllopathyDrugChecker />,
          },
          {
            path: '/allopathy/clinical-notes',
            element: <AllopathyClinicalNotes />,
          },
          {
            path: '/allopathy/s3-data-manager',
            element: <ProtectedAllopathyS3DataManager />,
          },

          //  ------ DNA Sequencing Routes ------
          {
            path: '/dna-sequencing',
            element: <Navigate to="/dna-sequencing/dashboard" replace />,
          },
          {
            path: '/dna-sequencing/dashboard',
            element: <DNASequencingDashboard />,
          },
          {
            path: '/dna-sequencing/analysis',
            element: <GenomeAnalysis />,
          },
          {
            path: '/dna-sequencing/samples',
            element: <SampleManagement />,
          },
          {
            path: '/dna-sequencing/variant-calling',
            element: <VariantCalling />,
          },
          {
            path: '/dna-sequencing/quality-control',
            element: <QualityControl />,
          },
          {
            path: '/dna-sequencing/reports',
            element: <Reports />,
          },
          {
            path: '/dna-sequencing/ai-lab',
            element: <AIGenomicsLab />,
          },
          {
            path: '/dna-sequencing/s3-data-manager',
            element: <ProtectedS3DataManager />,
          },
          {
            path: '/permission-test',
            element: <PermissionTestPage />,
          },
          {
            path: '/icon-test',
            element: <IconTest />,
          },

          //  ------ Calendar Route ------
          {
            path: '/calendar',
            element: <Calendar />,
          },

          //  ------ Chat Route ------
          {
            path: '/chat',
            element: <Chat />,
          },

          //  ------ UI Elements Route ------
          {
            path: '/ui-elements/alerts',
            element: <Alerts />,
          },
          {
            path: '/ui-elements/badges',
            element: <Badges />,
          },
          {
            path: '/ui-elements/breadcrumb',
            element: <Breadcrumb />,
          },
          {
            path: '/ui-elements/buttons',
            element: <Buttons />,
          },
          {
            path: '/ui-elements/cards',
            element: <Cards />,
          },
          {
            path: '/ui-elements/carousel',
            element: <Carousels />,
          },
          {
            path: '/ui-elements/colors',
            element: <Colors />,
          },
          {
            path: '/ui-elements/grid',
            element: <Grid />,
          },
          {
            path: '/ui-elements/images',
            element: <Images />,
          },
          {
            path: '/ui-elements/list-group',
            element: <ListGroups />,
          },
          {
            path: '/ui-elements/modal',
            element: <Modals />,
          },
          {
            path: '/ui-elements/notifications',
            element: <Notification />,
          },
          {
            path: '/ui-elements/pagination',
            element: <Paginations />,
          },
          {
            path: '/ui-elements/popovers',
            element: <Popovers />,
          },
          {
            path: '/ui-elements/progressbars',
            element: <Progressbars />,
          },
          {
            path: '/ui-elements/tabs',
            element: <Tabs />,
          },
          {
            path: '/ui-elements/tooltips',
            element: <Tooltips />,
          },
          {
            path: '/ui-elements/typography',
            element: <Typography />,
          },
          {
            path: '/ui-elements/video',
            element: <Video />,
          },

          //  ------ Form Route ------
          {
            path: '/forms/form-elements',
            element: <FormElements />,
          },

          {
            path: '/forms/form-validations',
            element: <FormValidatioins />,
          },

          {
            path: '/forms/form-switch',
            element: <FormSwitch />,
          },

          {
            path: '/forms/form-checkbox',
            element: <FormCheckbox />,
          },

          {
            path: '/forms/form-radio',
            element: <FormRadio />,
          },

          //  ------ Wizard Route ------
          {
            path: '/wizard/simple-wizard',
            element: <SimpalWizard />,
          },
          {
            path: '/wizard/validate-wizard',
            element: <ValidteWizard />,
          },
          {
            path: '/wizard/vertical-wizard',
            element: <VerticalWizard />,
          },

          //  ------ Table Route ------
          {
            path: '/tables/basic-table',
            element: <BasicTable />,
          },
          {
            path: '/tables/data-table',
            element: <DataTable />,
          },
          {
            path: '/tables/editable-table',
            element: <EditTable />,
          },

          //  ------ Chart Route ------
          {
            path: '/charts/chart-page',
            element: <ChartPage />,
          },
          {
            path: '/charts/e-chart',
            element: <EChart />,
          },
          {
            path: '/charts/chart-am',
            element: <ChartAm />,
          },
          {
            path: '/charts/apex-chart',
            element: <ApexChart />,
          },

          //  ------ Icons Route ------
          {
            path: '/icons/dripicons',
            element: <Dripicons />,
          },
          {
            path: '/icons/fontawesome-5',
            element: <FontAwsomeFive />,
          },
          {
            path: '/icons/line-awesome',
            element: <Lineawesome />,
          },
          {
            path: '/icons/remixicon',
            element: <Remixicon />,
          },
          {
            path: '/icons/unicons',
            element: <Unicons />,
          },

          //  ------ Map Route ------
          {
            path: '/maps/google-map',
            element: <GoogleMap />,
          },

          //  ------ ExtraPage Route ------
          {
            path: '/extra-pages/pages-timeline',
            element: <Timeline />,
          },
          {
            path: '/extra-pages/pages-invoice',
            element: <Invoice />,
          },
          {
            path: '/extra-pages/blank-page',
            element: <BlankPage />,
          },
          {
            path: '/extra-pages/pages-pricing',
            element: <Pricing />,
          },
          {
            path: '/extra-pages/pages-pricing-one',
            element: <PricingOne />,
          },
          {
            path: '/extra-pages/pages-faq',
            element: <Faq />,
          },
          {
            path: '/extra-pages/privacy-policy',
            element: <PrivacyPolicyFull />,
          },
          {
            path: '/extra-pages/terms-of-use',
            element: <TermsOfService />,
          },
          {
            path: '/extra-pages/account-setting',
            element: <AccountSetting />,
          },
          {
            path: '/extra-pages/privacy-setting',
            element: <PrivacySetting />,
          },
        ],
      },
    ],
  },
];

export const BlankLayoutRouter = [
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      {
        path: 'login',
        element: <Login />, // Add /auth/login route
      },
      {
        path: 'sign-in',
        element: <Login />, // Direct login instead of redirect
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
      {
        path: 'registration',
        element: <Registration />,
      },
      {
        path: 'recover-password',
        element: <RecoverPassword />,
      },
      {
        path: 'reset-password',
        element: <RecoverPassword />, // Same component handles token-based reset
      },
      {
        path: 'confirm-mail',
        element: <ConformMail />,
      },
      {
        path: 'lock-screen',
        element: <LockScreen />,
      },
    ],
  },
  {
    path: '/extra-pages',
    element: <BlankLayout />,
    children: [
      {
        path: 'pages-error-404',
        element: <Error404 />,
      },
      {
        path: 'pages-error-500',
        element: <Error500 />,
      },
      {
        path: 'pages-maintenance',
        element: <Maintenance />,
      },
      {
        path: 'pages-comingsoon',
        element: <CommingSoon />,
      },
    ],
  },
];
