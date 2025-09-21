import React, { useState, useEffect, useMemo } from 'react';
import { Card, Container, Row, Col, Badge, Alert, ProgressBar, Button, Dropdown } from 'react-bootstrap';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import S3DataManager from '../../components/s3/S3DataManager';
import { NEAT_SECURE_S3_CONFIG } from '../../config/neatSecureS3Config';

const NeatSecureS3DataManagerPage = () => {
  // Error handling and fallback configuration
  const safeConfig = useMemo(() => {
    try {
      return NEAT_SECURE_S3_CONFIG;
    } catch (error) {
      console.error('Failed to load NeatSecure S3 Config:', error);
      return {
        service: { name: 'NeatSecure S3 Data Manager', description: 'Loading...', version: '1.0.0' },
        ui: { theme: {}, layout: { containerFluid: true }, icons: {} },
        features: {},
        compliance: { educational: { standards: [] } },
        buckets: [],
        localization: { defaultLanguage: 'en', supportedLanguages: ['en'] },
        aws: { region: 'us-east-1' }
      };
    }
  }, []);

  // State management using soft coding
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [selectedLanguage, setSelectedLanguage] = useState(safeConfig.localization?.defaultLanguage || 'en');
  const [currentUser, setCurrentUser] = useState({ role: 'admin', permissions: ['read', 'write'] });
  const [systemMetrics, setSystemMetrics] = useState({
    totalBuckets: safeConfig.buckets?.length || 0,
    totalFiles: 0,
    totalStorage: '0 GB',
    activeUsers: 0,
    complianceScore: 98
  });

  // Configuration-driven UI elements with fallbacks
  const { ui = {}, features = {}, service = {}, compliance = {}, buckets = [] } = safeConfig;

  // Dynamic system health calculation with error handling
  const systemHealth = useMemo(() => {
    try {
      if (!features || typeof features !== 'object') {
        return { score: 0, status: 'needs-attention', enabledFeatures: 0, totalFeatures: 0 };
      }
      
      const enabledFeatures = Object.values(features).filter(Boolean).length;
      const totalFeatures = Object.keys(features).length;
      const healthScore = totalFeatures > 0 ? Math.round((enabledFeatures / totalFeatures) * 100) : 0;
      
      return {
        score: healthScore,
        status: healthScore > 80 ? 'excellent' : healthScore > 60 ? 'good' : 'needs-attention',
        enabledFeatures,
        totalFeatures
      };
    } catch (error) {
      console.error('Error calculating system health:', error);
      return { score: 0, status: 'needs-attention', enabledFeatures: 0, totalFeatures: 0 };
    }
  }, [features]);

  // Dynamic bucket categorization with error handling
  const bucketsByCategory = useMemo(() => {
    try {
      if (!Array.isArray(buckets)) {
        return {};
      }
      
      return buckets.reduce((acc, bucket) => {
        if (!bucket || typeof bucket !== 'object') return acc;
        const category = bucket.category || 'other';
        if (!acc[category]) acc[category] = [];
        acc[category].push(bucket);
        return acc;
      }, {});
    } catch (error) {
      console.error('Error categorizing buckets:', error);
      return {};
    }
  }, [buckets]);

  // Connection status simulation
  useEffect(() => {
    const checkConnection = setTimeout(() => {
      setConnectionStatus('connected');
      // Simulate metrics calculation
      setSystemMetrics(prev => ({
        ...prev,
        totalFiles: Math.floor(Math.random() * 10000) + 1000,
        totalStorage: (Math.random() * 100 + 10).toFixed(1) + ' GB',
        activeUsers: Math.floor(Math.random() * 500) + 100
      }));
    }, 1500);

    return () => clearTimeout(checkConnection);
  }, []);

  // Dynamic badge rendering based on compliance with error handling
  const renderComplianceBadges = () => {
    try {
      const standards = compliance?.educational?.standards || [];
      if (!Array.isArray(standards)) {
        return null;
      }
      
      return standards.map(standard => (
        <Badge 
          key={standard} 
          bg="success" 
          className="me-1 mb-1"
          style={{ fontSize: '0.75rem' }}
        >
          <i className={ui?.icons?.shield || 'ri-shield-check-line'} style={{ fontSize: '0.7rem', marginRight: '2px' }}></i>
          {standard}
        </Badge>
      ));
    } catch (error) {
      console.error('Error rendering compliance badges:', error);
      return null;
    }
  };

  // Dynamic feature cards rendering
  const renderFeatureCards = () => {
    const featureCategories = {
      security: {
        title: 'Security Features',
        icon: 'ri-shield-check-fill',
        color: 'success',
        features: ['enableEncryption', 'enableAuditLog', 'enableCompliance']
      },
      educational: {
        title: 'Educational Features',
        icon: 'ri-graduation-cap-fill',
        color: 'primary',
        features: ['enableAnalytics', 'enableMultiLanguage', 'enableAI']
      },
      system: {
        title: 'System Features',
        icon: 'ri-settings-3-fill',
        color: 'info',
        features: ['enableVersioning', 'enableBackup']
      }
    };

    return Object.entries(featureCategories).map(([key, category]) => (
      <Col lg={4} md={6} key={key} className="mb-3">
        <Card className="border-0 shadow-sm h-100">
          <Card.Header className="bg-transparent border-0 pb-2">
            <h6 className="mb-0">
              <i className={`${category.icon} me-2 text-${category.color}`}></i>
              {category.title}
            </h6>
          </Card.Header>
          <Card.Body className="pt-2">
            {category.features.map(feature => (
              <div key={feature} className="d-flex align-items-center mb-2">
                <i className={`ri-${features[feature] ? 'check' : 'close'}-line text-${features[feature] ? 'success' : 'danger'} me-2`}></i>
                <small className={features[feature] ? '' : 'text-muted'}>
                  {feature.replace('enable', '').replace(/([A-Z])/g, ' $1').trim()}
                </small>
              </div>
            ))}
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  // Dynamic bucket overview with permissions
  const renderBucketOverview = () => {
    const visibleBuckets = buckets.filter(bucket => 
      bucket.permissions.read.includes(currentUser.role) || 
      currentUser.role === 'admin'
    );

    return visibleBuckets
      .sort((a, b) => a.priority - b.priority)
      .map((bucket) => (
        <Col lg={2} md={4} sm={6} key={bucket.id} className="mb-3">
          <Card className="border-0 shadow-sm h-100 position-relative">
            <Card.Body className="text-center p-3">
              <div 
                className="rounded-circle text-white p-3 mx-auto mb-3" 
                style={{
                  width: '50px', 
                  height: '50px',
                  backgroundColor: bucket.color,
                  fontSize: '1.2rem'
                }}
              >
                <i className={bucket.icon}></i>
              </div>
              <h6 className="mb-1 small">{bucket.displayName}</h6>
              <p className="text-muted small mb-2" style={{ fontSize: '0.7rem' }}>
                {bucket.description.length > 35 
                  ? bucket.description.substring(0, 35) + '...' 
                  : bucket.description
                }
              </p>
              
              {/* Permission indicators */}
              <div className="d-flex justify-content-center gap-1 mb-2">
                {bucket.permissions.read.includes(currentUser.role) && (
                  <Badge bg="success" style={{ fontSize: '0.6rem' }}>R</Badge>
                )}
                {bucket.permissions.write.includes(currentUser.role) && (
                  <Badge bg="warning" style={{ fontSize: '0.6rem' }}>W</Badge>
                )}
                {bucket.permissions.delete.includes(currentUser.role) && (
                  <Badge bg="danger" style={{ fontSize: '0.6rem' }}>D</Badge>
                )}
              </div>

              {/* Dynamic file stats */}
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.65rem' }}>
                <span>Files: {Math.floor(Math.random() * 500) + 50}</span>
                <span>Size: {(Math.random() * 5 + 0.5).toFixed(1)}GB</span>
              </div>
              
              {/* Security indicator */}
              {bucket.security.encryption && (
                <div className="position-absolute top-0 end-0 m-2">
                  <Badge bg="success" style={{ fontSize: '0.6rem' }}>
                    <i className="ri-lock-fill"></i>
                  </Badge>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      ));
  };

  return (
    <Container fluid={ui.layout.containerFluid}>
      {/* Dynamic Header Section */}
      {ui.layout.showHeader && (
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="mb-2 mb-md-0">
                <h2 className="mb-1" style={{ color: ui.theme.primaryColor }}>
                  <i className={`${ui.icons.service} me-2`}></i>
                  {service.name}
                </h2>
                <p className="text-muted mb-0">
                  {service.description} <Badge bg="secondary" className="ms-2">v{service.version}</Badge>
                </p>
              </div>
              <div className="d-flex align-items-center gap-2">
                
                {/* Language Selector */}
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <i className="ri-global-line me-1"></i>
                    {selectedLanguage.toUpperCase()}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {NEAT_SECURE_S3_CONFIG.localization.supportedLanguages.map(lang => (
                      <Dropdown.Item 
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        active={lang === selectedLanguage}
                      >
                        {lang.toUpperCase()}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* Refresh Button */}
                {ui.layout.enableRefresh && (
                  <Button variant="outline-primary" size="sm">
                    <i className={`${ui.icons.refresh} me-1`}></i>
                    Refresh
                  </Button>
                )}
                
                {/* Compliance Badges */}
                <div className="d-flex flex-wrap">
                  {renderComplianceBadges()}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}

      {/* System Status Alert */}
      <Row className="mb-4">
        <Col>
          <Alert 
            variant={systemHealth.status === 'excellent' ? 'success' : 'warning'} 
            className="border-0 shadow-sm"
          >
            <div className="d-flex align-items-center">
              <i className={`${ui.icons.shield} text-${systemHealth.status === 'excellent' ? 'success' : 'warning'} me-3 fs-4`}></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">
                  {service.name} - {systemHealth.status === 'excellent' ? 'Optimal' : 'Monitoring'} Status
                </h6>
                <p className="mb-0 small text-muted">
                  Health Score: <strong>{systemHealth.score}%</strong> | 
                  Features: <strong>{systemHealth.enabledFeatures}/{systemHealth.totalFeatures}</strong> | 
                  Compliance: <strong>{systemMetrics.complianceScore}%</strong> | 
                  Region: <strong>{NEAT_SECURE_S3_CONFIG.aws.region}</strong> |
                  Environment: <strong>{service.environment}</strong>
                </p>
              </div>
            </div>
          </Alert>
        </Col>
      </Row>

      {/* Dynamic Stats Overview */}
      {ui.layout.showStats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <i className="ri-database-2-line fs-1 text-primary mb-2"></i>
                <h5 className="text-primary">{systemMetrics.totalBuckets}</h5>
                <small className="text-muted">Active Buckets</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <i className="ri-file-list-line fs-1 text-success mb-2"></i>
                <h5 className="text-success">{systemMetrics.totalFiles.toLocaleString()}</h5>
                <small className="text-muted">Total Files</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <i className="ri-hard-drive-line fs-1 text-info mb-2"></i>
                <h5 className="text-info">{systemMetrics.totalStorage}</h5>
                <small className="text-muted">Storage Used</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body>
                <i className="ri-user-line fs-1 text-warning mb-2"></i>
                <h5 className="text-warning">{systemMetrics.activeUsers}</h5>
                <small className="text-muted">Active Users</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Educational Buckets Overview */}
      <Row className="mb-4">
        <Col>
          <h5 className="mb-3">
            <i className="ri-folder-3-line me-2"></i>
            Storage Buckets Overview
            <Badge bg="info" className="ms-2" style={{ fontSize: '0.7rem' }}>
              {Object.keys(bucketsByCategory).length} Categories
            </Badge>
          </h5>
        </Col>
      </Row>
      <Row className="mb-4">
        {renderBucketOverview()}
      </Row>

      {/* Dynamic Feature Cards */}
      <Row className="mb-4">
        {renderFeatureCards()}
      </Row>

      {/* S3 Data Manager Component */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h6 className="mb-0">
                <i className={`${ui.icons.folder} me-2`}></i>
                Educational Data Storage Management
                <Badge bg="primary" className="ms-2" style={{ fontSize: '0.7rem' }}>
                  {connectionStatus === 'connected' ? 'Live' : 'Connecting...'}
                </Badge>
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <S3DataManager config={NEAT_SECURE_S3_CONFIG} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Educational Guidelines */}
      {ui.layout.showGuidelines && (
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-transparent border-0">
                <h6 className="mb-0">
                  <i className={`${ui.icons.info} me-2`} style={{ color: ui.theme.infoColor }}></i>
                  Educational Data Management Guidelines
                </h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  {Object.entries(bucketsByCategory).map(([category, categoryBuckets]) => (
                    <Col lg={4} md={6} key={category} className="mb-4">
                      <h6 className="text-capitalize" style={{ color: ui.theme.primaryColor }}>
                        <i className="ri-folder-line me-1"></i>
                        {category} Management
                      </h6>
                      <ul className="list-unstyled small">
                        {categoryBuckets.slice(0, 3).map(bucket => (
                          <li key={bucket.id} className="mb-1">
                            • Use <code>{bucket.name}</code> for {bucket.description.toLowerCase()}
                          </li>
                        ))}
                        {categoryBuckets.length > 3 && (
                          <li className="text-muted">• And {categoryBuckets.length - 3} more...</li>
                        )}
                      </ul>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

// Protected wrapper for NeatSecure S3 Data Manager
const ProtectedNeatSecureS3DataManager = () => {
  return (
    <ProtectedRoute 
      permission="canAccessSecureneatModule" 
      moduleName="NeatSecure S3 Data Manager"
    >
      <NeatSecureS3DataManagerPage />
    </ProtectedRoute>
  );
};

export default ProtectedNeatSecureS3DataManager;
