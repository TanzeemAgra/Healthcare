import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Tab, Tabs } from 'react-bootstrap';
import { 
  RiSettings4Line,
  RiSecurePaymentFill,
  RiNotificationLine,
  RiMailLine,
  RiDatabaseLine,
  RiShieldCheckLine,
  RiSaveLine,
  RiRefreshLine
} from '@remixicon/react';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');

  // Mock settings data
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Healthcare Management System',
      siteDescription: 'Comprehensive healthcare management platform',
      contactEmail: 'support@xerxez.com',
      maintenanceMode: false,
      allowRegistration: true,
      defaultUserRole: 'patient'
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUsername: 'support@xerxez.com',
      smtpPassword: '••••••••••••',
      fromEmail: 'noreply@xerxez.com',
      fromName: 'Healthcare System'
    },
    security: {
      sessionTimeout: '30',
      passwordMinLength: '8',
      requireTwoFactor: false,
      allowPasswordReset: true,
      maxLoginAttempts: '5',
      ipWhitelist: ''
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      systemAlerts: true
    }
  });

  const handleSave = (tab) => {
    setAlertType('success');
    setAlertMessage(`${tab.charAt(0).toUpperCase() + tab.slice(1)} settings saved successfully!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleInputChange = (tab, field, value) => {
    setSettings(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const GeneralSettings = () => (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <RiSettings4Line size={20} className="me-2" />
          General Settings
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type="text"
                value={settings.general.siteName}
                onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Contact Email</Form.Label>
              <Form.Control
                type="email"
                value={settings.general.contactEmail}
                onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Site Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={settings.general.siteDescription}
            onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
          />
        </Form.Group>

        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Default User Role</Form.Label>
              <Form.Select
                value={settings.general.defaultUserRole}
                onChange={(e) => handleInputChange('general', 'defaultUserRole', e.target.value)}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="pharmacist">Pharmacist</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="maintenance-mode"
                  checked={settings.general.maintenanceMode}
                  onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
                  className="me-3"
                />
                <Form.Label htmlFor="maintenance-mode" className="mb-0">
                  Maintenance Mode
                </Form.Label>
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="allow-registration"
                  checked={settings.general.allowRegistration}
                  onChange={(e) => handleInputChange('general', 'allowRegistration', e.target.checked)}
                  className="me-3"
                />
                <Form.Label htmlFor="allow-registration" className="mb-0">
                  Allow Registration
                </Form.Label>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" onClick={() => handleSave('general')}>
          <RiSaveLine size={16} className="me-1" />
          Save General Settings
        </Button>
      </Card.Body>
    </Card>
  );

  const SecuritySettings = () => (
    <Card>
      <Card.Header>
        <h5 className="mb-0">
          <RiShieldCheckLine size={20} className="me-2" />
          Security Settings
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Session Timeout (minutes)</Form.Label>
              <Form.Control
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Password Minimum Length</Form.Label>
              <Form.Control
                type="number"
                value={settings.security.passwordMinLength}
                onChange={(e) => handleInputChange('security', 'passwordMinLength', e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Max Login Attempts</Form.Label>
              <Form.Control
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleInputChange('security', 'maxLoginAttempts', e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="switch"
                  id="require-2fa"
                  checked={settings.security.requireTwoFactor}
                  onChange={(e) => handleInputChange('security', 'requireTwoFactor', e.target.checked)}
                  className="me-3"
                />
                <Form.Label htmlFor="require-2fa" className="mb-0">
                  Require Two-Factor Authentication
                </Form.Label>
              </div>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>IP Whitelist (one per line)</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="192.168.1.1&#10;10.0.0.1&#10;..."
            value={settings.security.ipWhitelist}
            onChange={(e) => handleInputChange('security', 'ipWhitelist', e.target.value)}
          />
          <Form.Text className="text-muted">
            Leave empty to allow all IPs. Enter one IP address per line.
          </Form.Text>
        </Form.Group>

        <Button variant="primary" onClick={() => handleSave('security')}>
          <RiSaveLine size={16} className="me-1" />
          Save Security Settings
        </Button>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-0">System Settings</h2>
              <p className="text-muted mb-0">Configure system-wide settings and preferences</p>
            </div>
            <Badge bg="success">Super Admin Access</Badge>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant={alertType} className="mb-4" dismissible onClose={() => setShowAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="general" title={
          <span>
            <RiSettings4Line size={16} className="me-1" />
            General
          </span>
        }>
          <GeneralSettings />
        </Tab>

        <Tab eventKey="security" title={
          <span>
            <RiShieldCheckLine size={16} className="me-1" />
            Security
          </span>
        }>
          <SecuritySettings />
        </Tab>

        <Tab eventKey="email" title={
          <span>
            <RiMailLine size={16} className="me-1" />
            Email
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <RiMailLine size={20} className="me-2" />
                Email Configuration
              </h5>
            </Card.Header>
            <Card.Body>
              <Alert variant="info">
                <RiNotificationLine size={16} className="me-2" />
                Email settings are configured and working properly.
              </Alert>
              <p>SMTP Host: {settings.email.smtpHost}</p>
              <p>From Email: {settings.email.fromEmail}</p>
              <Button variant="primary">
                <RiRefreshLine size={16} className="me-1" />
                Test Email Configuration
              </Button>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="notifications" title={
          <span>
            <RiNotificationLine size={16} className="me-1" />
            Notifications
          </span>
        }>
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <RiNotificationLine size={20} className="me-2" />
                Notification Settings
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        id="email-notifications"
                        checked={settings.notifications.emailNotifications}
                        onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                        className="me-3"
                      />
                      <Form.Label htmlFor="email-notifications" className="mb-0">
                        Email Notifications
                      </Form.Label>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        id="push-notifications"
                        checked={settings.notifications.pushNotifications}
                        onChange={(e) => handleInputChange('notifications', 'pushNotifications', e.target.checked)}
                        className="me-3"
                      />
                      <Form.Label htmlFor="push-notifications" className="mb-0">
                        Push Notifications
                      </Form.Label>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        id="appointment-reminders"
                        checked={settings.notifications.appointmentReminders}
                        onChange={(e) => handleInputChange('notifications', 'appointmentReminders', e.target.checked)}
                        className="me-3"
                      />
                      <Form.Label htmlFor="appointment-reminders" className="mb-0">
                        Appointment Reminders
                      </Form.Label>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="switch"
                        id="system-alerts"
                        checked={settings.notifications.systemAlerts}
                        onChange={(e) => handleInputChange('notifications', 'systemAlerts', e.target.checked)}
                        className="me-3"
                      />
                      <Form.Label htmlFor="system-alerts" className="mb-0">
                        System Alerts
                      </Form.Label>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" onClick={() => handleSave('notifications')}>
                <RiSaveLine size={16} className="me-1" />
                Save Notification Settings
              </Button>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SystemSettings;
