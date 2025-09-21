import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Dropdown, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import performLogout from '../utils/logout';
import { 
  RiMedicineBottleLine, 
  RiDashboardLine, 
  RiUserLine, 
  RiStethoscopeLine, 
  RiShieldCheckLine, 
  RiMenuLine,
  RiSettings4Line,
  RiTeamLine,
  RiVipCrownLine,
  RiBarChartBoxLine,
  RiFileListLine,
  RiSecurePaymentFill
} from '@remixicon/react';

const Navigation = ({ isLandingPage = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Use real auth context with error handling
  let authData;
  try {
    authData = useAuth();
  } catch (error) {
    console.warn('Auth context error:', error);
    authData = {
      isAuthenticated: false,
      user: null,
      canAccessAdmin: () => false,
      logout: () => {}
    };
  }
  
  const { isAuthenticated, user, canAccessAdmin, logout } = authData;
  const dispatch = useDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      console.log('🔄 Navigation logout started...');
      console.log('Dispatch available:', !!dispatch);
      console.log('Navigate available:', !!navigate);
      console.log('AuthContext logout available:', !!logout);
      
      // Use the comprehensive logout utility with AuthContext logout
      await performLogout(dispatch, navigate, logout);
    } catch (error) {
      console.error('❌ Navigation logout error:', error);
      // Force logout as fallback
      localStorage.clear();
      sessionStorage.clear();
      if (dispatch) dispatch({ type: 'auth/logout' });
      if (logout) logout();
      window.location.href = '/login';
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      console.log(`Scrolling to section: ${sectionId}`);
    } else {
      console.warn(`Section with ID '${sectionId}' not found`);
    }
  };

  const navbarStyle = {
    transition: 'all 0.3s ease',
    backgroundColor: isLandingPage 
      ? (isScrolled ? 'rgba(15, 15, 15, 0.95)' : 'rgba(15, 15, 15, 0.8)') 
      : 'rgba(15, 15, 15, 1)',
    backdropFilter: isLandingPage ? 'blur(10px)' : 'none',
    boxShadow: isScrolled ? '0 2px 20px rgba(229, 9, 20, 0.2)' : '0 2px 10px rgba(0,0,0,0.3)',
    position: isLandingPage ? 'fixed' : 'static',
    top: 0,
    width: '100%',
    zIndex: 1030,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  };

  return (
    <Navbar 
      expand="lg" 
      variant="dark"
      style={navbarStyle}
      className={isLandingPage ? 'landing-navbar' : ''}
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <RiMedicineBottleLine size={32} className="me-2" style={{
            color: '#E50914'
          }} />
          <span style={{ 
            fontWeight: 'bold', 
            fontSize: '1.5rem',
            color: '#fff',
            textShadow: 'none'
          }}>
            Mastermind
          </span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <RiMenuLine size={24} style={{
            color: '#fff'
          }} />
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLandingPage ? (
              <>
                <Nav.Link 
                  onClick={() => scrollToSection('hero')}
                  style={{ cursor: 'pointer' }}
                >
                  Home
                </Nav.Link>
                <Nav.Link 
                  onClick={() => scrollToSection('features')}
                  style={{ cursor: 'pointer' }}
                >
                  Features
                </Nav.Link>
                <Nav.Link 
                  onClick={() => scrollToSection('medical-modules')}
                  style={{ cursor: 'pointer' }}
                >
                  Medical Modules
                </Nav.Link>
                <Nav.Link 
                  onClick={() => scrollToSection('pricing-section')}
                  style={{ cursor: 'pointer' }}
                >
                  Pricing
                </Nav.Link>
                <Nav.Link 
                  onClick={() => scrollToSection('demo')}
                  style={{ cursor: 'pointer' }}
                >
                  Demo
                </Nav.Link>
                <Nav.Link as={Link} to="/healthcare-modules" style={{ cursor: 'pointer' }}>
                  <RiStethoscopeLine size={16} className="me-1" />
                  Healthcare Modules
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                {canAccessAdmin() && (
                  <NavDropdown 
                    title={
                      <span>
                        <RiShieldCheckLine size={16} className="me-1" />
                        Admin Management
                      </span>
                    } 
                    id="admin-nav-dropdown"
                    className="admin-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/admin/dashboard">
                      <RiDashboardLine size={16} className="me-2" />
                      Dashboard
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/user-management">
                      <RiUserLine size={16} className="me-2" />
                      User Management
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/staff-management">
                      <RiTeamLine size={16} className="me-2" />
                      Staff Management
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/analytics">
                      <RiBarChartBoxLine size={16} className="me-2" />
                      Analytics & Reports
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/system-settings">
                      <RiSettings4Line size={16} className="me-2" />
                      System Settings
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/security">
                      <RiSecurePaymentFill size={16} className="me-2" />
                      Security & Compliance
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/admin/notifications">
                      <RiNotificationLine size={16} className="me-2" />
                      Notifications
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin/backup">
                      <RiDatabase2Line size={16} className="me-2" />
                      Backup & Recovery
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
              </>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  <RiUserLine size={16} className="me-1" />
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <Nav.Link 
                  as={Link} 
                  to="/login"
                  className="d-flex align-items-center"
                  style={{
                    color: isLandingPage ? '#fff' : '#333',
                    fontWeight: '500',
                    textDecoration: 'none',
                    padding: '8px 16px'
                  }}
                >
                  Login
                </Nav.Link>
                <Link 
                  to="/auth/registration"
                  className="btn"
                  style={{
                    background: 'linear-gradient(135deg, #007bff, #0056b3)',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '10px 25px',
                    fontWeight: '600',
                    color: '#fff',
                    boxShadow: '0 2px 10px rgba(0, 123, 255, 0.3)',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    lineHeight: '1.2'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 20px rgba(0, 123, 255, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 10px rgba(0, 123, 255, 0.3)';
                  }}
                >
                  Registration
                </Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
