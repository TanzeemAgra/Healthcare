import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Table,
  Form,
  InputGroup,
  Dropdown,
  Alert,
  Pagination
} from 'react-bootstrap';
import {
  RiFileList3Line,
  RiDownloadLine,
  RiRefreshLine,
  RiSearchLine,
  RiFilterLine,
  RiErrorWarningLine,
  RiInformationLine,
  RiAlertLine,
  RiCheckLine
} from '@remixicon/react';
import { usePermissions } from '../../contexts/PermissionContext';

const SystemLogs = () => {
  const { canAccessUserManagement, isSuperAdmin } = usePermissions();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(20);

  // Check permissions
  if (!canAccessUserManagement && !isSuperAdmin) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger">
          <Alert.Heading>Access Denied</Alert.Heading>
          <p>You don't have permission to view system logs. Contact your administrator for access.</p>
        </Alert>
      </Container>
    );
  }

  // Sample log data (in production, this would come from an API)
  const sampleLogs = [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      level: 'INFO',
      source: 'Authentication',
      message: 'User login successful',
      details: 'Admin user logged in successfully',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      level: 'WARNING',
      source: 'Permission',
      message: 'Access attempt to restricted resource',
      details: 'User attempted to access /admin/system-settings without permission',
      ip: '192.168.1.102'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      level: 'ERROR',
      source: 'Database',
      message: 'Connection timeout',
      details: 'Database connection timed out after 30 seconds',
      ip: 'localhost'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 900000).toISOString(),
      level: 'SUCCESS',
      source: 'Backup',
      message: 'System backup completed',
      details: 'Daily backup completed successfully, 2.3GB',
      ip: 'system'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1200000).toISOString(),
      level: 'INFO',
      source: 'API',
      message: 'API request processed',
      details: 'GET /api/hospital/management/me/permissions/ - 200 OK',
      ip: '192.168.1.105'
    }
  ];

  useEffect(() => {
    // Simulate loading logs
    const loadLogs = async () => {
      setLoading(true);
      // In production, this would be an API call
      setTimeout(() => {
        setLogs(sampleLogs);
        setFilteredLogs(sampleLogs);
        setLoading(false);
      }, 1000);
    };

    loadLogs();
  }, []);

  useEffect(() => {
    // Filter logs based on search term and level
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterLevel !== 'all') {
      filtered = filtered.filter(log => log.level === filterLevel);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterLevel, logs]);

  const getLevelBadge = (level) => {
    const variants = {
      INFO: 'info',
      WARNING: 'warning',
      ERROR: 'danger',
      SUCCESS: 'success'
    };

    const icons = {
      INFO: RiInformationLine,
      WARNING: RiAlertLine,
      ERROR: RiErrorWarningLine,
      SUCCESS: RiCheckLine
    };

    const IconComponent = icons[level];

    return (
      <Badge bg={variants[level]} className="d-flex align-items-center gap-1">
        <IconComponent size={14} />
        {level}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const refreshLogs = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLogs([...sampleLogs]);
      setFilteredLogs([...sampleLogs]);
      setLoading(false);
    }, 500);
  };

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `system_logs_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <Container fluid className="p-4">
      <Row>
        <Col>
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">
                <RiFileList3Line className="me-2" />
                System Logs
              </h2>
              <p className="text-muted mb-0">Monitor system activities and events</p>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" onClick={exportLogs}>
                <RiDownloadLine size={16} className="me-1" />
                Export Logs
              </Button>
              <Button variant="primary" size="sm" onClick={refreshLogs}>
                <RiRefreshLine size={16} className="me-1" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text>
                      <RiSearchLine />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                  >
                    <option value="all">All Levels</option>
                    <option value="SUCCESS">Success</option>
                    <option value="INFO">Info</option>
                    <option value="WARNING">Warning</option>
                    <option value="ERROR">Error</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <div className="text-muted small">
                    Showing {filteredLogs.length} of {logs.length} logs
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Logs Table */}
          <Card>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading system logs...</p>
                </div>
              ) : (
                <>
                  <Table responsive hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th>Timestamp</th>
                        <th>Level</th>
                        <th>Source</th>
                        <th>Message</th>
                        <th>IP Address</th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentLogs.length > 0 ? (
                        currentLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="text-nowrap">
                              <small>{formatTimestamp(log.timestamp)}</small>
                            </td>
                            <td>{getLevelBadge(log.level)}</td>
                            <td>
                              <Badge bg="secondary" pill>
                                {log.source}
                              </Badge>
                            </td>
                            <td>{log.message}</td>
                            <td>
                              <code className="small">{log.ip}</code>
                            </td>
                            <td>
                              <small className="text-muted">{log.details}</small>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center p-4">
                            <div className="text-muted">
                              <RiFileList3Line size={48} className="mb-2" />
                              <p>No logs found matching your criteria</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center p-3 border-top">
                      <div className="text-muted small">
                        Showing {indexOfFirstLog + 1} to {Math.min(indexOfLastLog, filteredLogs.length)} of {filteredLogs.length} entries
                      </div>
                      <Pagination className="mb-0">
                        <Pagination.Prev 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        />
                        {[...Array(totalPages)].map((_, index) => (
                          <Pagination.Item
                            key={index + 1}
                            active={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </Pagination.Item>
                        ))}
                        <Pagination.Next
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        />
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </Card.Body>
          </Card>

          {/* Log Statistics */}
          <Row className="mt-4">
            <Col md={3}>
              <Card className="text-center border-success">
                <Card.Body>
                  <h4 className="text-success">{logs.filter(l => l.level === 'SUCCESS').length}</h4>
                  <small className="text-muted">Success Events</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info">
                <Card.Body>
                  <h4 className="text-info">{logs.filter(l => l.level === 'INFO').length}</h4>
                  <small className="text-muted">Info Events</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <h4 className="text-warning">{logs.filter(l => l.level === 'WARNING').length}</h4>
                  <small className="text-muted">Warning Events</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-danger">
                <Card.Body>
                  <h4 className="text-danger">{logs.filter(l => l.level === 'ERROR').length}</h4>
                  <small className="text-muted">Error Events</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SystemLogs;
