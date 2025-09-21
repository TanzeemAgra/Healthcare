import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form, InputGroup, ProgressBar } from 'react-bootstrap';

const PathologyAnalytics = () => {
  const [dateRange, setDateRange] = useState('last-30-days');

  const analyticsData = {
    totalTests: 2456,
    completedTests: 2298,
    pendingTests: 158,
    averageTAT: '4.2 hours',
    testAccuracy: 98.7,
    monthlyGrowth: 12.5,
    topTests: [
      { name: 'Complete Blood Count', count: 456, percentage: 18.6 },
      { name: 'Liver Function Test', count: 398, percentage: 16.2 },
      { name: 'Urine Analysis', count: 312, percentage: 12.7 },
      { name: 'Thyroid Function', count: 287, percentage: 11.7 },
      { name: 'Lipid Profile', count: 234, percentage: 9.5 }
    ],
    departmentPerformance: [
      { department: 'Clinical Chemistry', tests: 854, accuracy: 99.1, avgTAT: '3.8 hours' },
      { department: 'Hematology', tests: 623, accuracy: 98.9, avgTAT: '2.5 hours' },
      { department: 'Immunology', tests: 445, accuracy: 98.3, avgTAT: '6.2 hours' },
      { department: 'Microbiology', tests: 378, accuracy: 97.8, avgTAT: '12.4 hours' },
      { department: 'Histopathology', tests: 156, accuracy: 99.5, avgTAT: '24.6 hours' }
    ]
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h3 mb-0">Pathology Analytics</h1>
            <div className="d-flex gap-2">
              <Form.Select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="last-year">Last Year</option>
              </Form.Select>
              <Button variant="outline-primary">
                <i className="ri-download-line me-2"></i>
                Export Report
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Key Metrics */}
      <Row className="g-4 mb-4">
        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-primary text-white mb-3 mx-auto d-flex align-items-center justify-content-center" 
                   style={{width: '60px', height: '60px', borderRadius: '50%'}}>
                <i className="ri-test-tube-fill fs-4"></i>
              </div>
              <h3 className="h4 mb-1">{analyticsData.totalTests.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Tests</p>
              <small className="text-success">
                <i className="ri-arrow-up-line"></i> +{analyticsData.monthlyGrowth}% this month
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-success text-white mb-3 mx-auto d-flex align-items-center justify-content-center" 
                   style={{width: '60px', height: '60px', borderRadius: '50%'}}>
                <i className="ri-checkbox-circle-fill fs-4"></i>
              </div>
              <h3 className="h4 mb-1">{analyticsData.completedTests.toLocaleString()}</h3>
              <p className="text-muted mb-0">Completed Tests</p>
              <small className="text-muted">
                {((analyticsData.completedTests / analyticsData.totalTests) * 100).toFixed(1)}% completion rate
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-info text-white mb-3 mx-auto d-flex align-items-center justify-content-center" 
                   style={{width: '60px', height: '60px', borderRadius: '50%'}}>
                <i className="ri-time-fill fs-4"></i>
              </div>
              <h3 className="h4 mb-1">{analyticsData.averageTAT}</h3>
              <p className="text-muted mb-0">Average TAT</p>
              <small className="text-success">
                <i className="ri-arrow-down-line"></i> 15% faster than last month
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="icon-circle bg-warning text-white mb-3 mx-auto d-flex align-items-center justify-content-center" 
                   style={{width: '60px', height: '60px', borderRadius: '50%'}}>
                <i className="ri-shield-check-fill fs-4"></i>
              </div>
              <h3 className="h4 mb-1">{analyticsData.testAccuracy}%</h3>
              <p className="text-muted mb-0">Accuracy Rate</p>
              <small className="text-success">
                <i className="ri-arrow-up-line"></i> +0.3% improvement
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Top Tests */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Most Requested Tests</h5>
            </Card.Header>
            <Card.Body>
              {analyticsData.topTests.map((test, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-medium">{test.name}</span>
                    <Badge bg="primary">{test.count}</Badge>
                  </div>
                  <ProgressBar 
                    now={test.percentage} 
                    variant="primary" 
                    style={{ height: '6px' }}
                  />
                  <small className="text-muted">{test.percentage}% of total tests</small>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        {/* Department Performance */}
        <Col lg={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Department Performance</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Tests</th>
                      <th>Accuracy</th>
                      <th>Avg TAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.departmentPerformance.map((dept, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{dept.department}</strong>
                        </td>
                        <td>{dept.tests}</td>
                        <td>
                          <Badge 
                            bg={dept.accuracy >= 99 ? 'success' : dept.accuracy >= 98 ? 'primary' : 'warning'}
                          >
                            {dept.accuracy}%
                          </Badge>
                        </td>
                        <td>{dept.avgTAT}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Analytics Cards */}
      <Row className="g-4 mt-2">
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Quality Metrics</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Sample Rejection Rate</span>
                <Badge bg="success">0.8%</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Critical Value Alerts</span>
                <Badge bg="warning">23</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Equipment Downtime</span>
                <Badge bg="info">0.5%</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Staff Efficiency</span>
                <Badge bg="primary">94.2%</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Workload Distribution</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Morning Shift (6AM-2PM)</span>
                <Badge bg="primary">45%</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Afternoon Shift (2PM-10PM)</span>
                <Badge bg="info">38%</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Night Shift (10PM-6AM)</span>
                <Badge bg="secondary">17%</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Peak Hours</span>
                <Badge bg="warning">8AM-11AM</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-transparent border-0">
              <h5 className="mb-0">Revenue Analytics</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Monthly Revenue</span>
                <Badge bg="success">$78,450</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Average Test Value</span>
                <Badge bg="primary">$31.95</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span>Growth Rate</span>
                <Badge bg="info">+12.5%</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Profit Margin</span>
                <Badge bg="warning">68.3%</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PathologyAnalytics;
