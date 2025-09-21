import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { 
  RiDashboardLine, 
  RiRobotLine, 
  RiBookOpenLine, 
  RiQuestionLine, 
  RiUserLine,
  RiBarChartLine,
  RiCalendarLine,
  RiAwardLine
} from '@remixicon/react';

const NewSecureNeatDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Demo data for the dashboard
  const dashboardStats = {
    totalStudySessions: 45,
    weeklyProgress: 78,
    completedMCQs: 230,
    osceScenarios: 12,
    chatbotInteractions: 67
  };

  const recentActivities = [
    { id: 1, activity: 'Completed Cardiology MCQ Set', time: '2 hours ago', score: 85 },
    { id: 2, activity: 'Practiced OSCE - Patient History', time: '5 hours ago', score: 92 },
    { id: 3, activity: 'AI Chat Session - Pharmacology', time: '1 day ago', score: null },
    { id: 4, activity: 'Completed Neurology Assessment', time: '2 days ago', score: 78 }
  ];

  const upcomingExams = [
    { name: 'Internal Medicine Finals', date: '2025-08-25', daysLeft: 13 },
    { name: 'Surgery OSCE', date: '2025-09-02', daysLeft: 21 },
    { name: 'Pharmacology Midterm', date: '2025-09-10', daysLeft: 29 }
  ];

  useEffect(() => {
    console.log('🎯 SecureNeat Dashboard - Loaded successfully without restrictions');
  }, []);

  return (
    <div className="container-fluid p-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">
            <RiDashboardLine className="me-2" />
            SecureNeat Dashboard
          </h1>
          <p className="text-muted mb-0">Welcome to your medical learning platform</p>
        </div>
        <Badge bg="success" pill className="fs-6">
          ✅ Full Access Granted
        </Badge>
      </div>

      {/* Stats Cards Row */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                    <RiBookOpenLine className="text-primary" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">Study Sessions</h6>
                  <h4 className="mb-0">{dashboardStats.totalStudySessions}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-success bg-opacity-10 rounded-circle p-3">
                    <RiQuestionLine className="text-success" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">MCQs Completed</h6>
                  <h4 className="mb-0">{dashboardStats.completedMCQs}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-info bg-opacity-10 rounded-circle p-3">
                    <RiAwardLine className="text-info" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">OSCE Scenarios</h6>
                  <h4 className="mb-0">{dashboardStats.osceScenarios}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                    <RiRobotLine className="text-warning" size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h6 className="text-muted mb-1">AI Chats</h6>
                  <h4 className="mb-0">{dashboardStats.chatbotInteractions}</h4>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Row */}
      <Row>
        {/* Progress and Quick Actions */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <Card.Title className="mb-0">
                <RiBarChartLine className="me-2" />
                Weekly Progress
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Overall Progress</span>
                  <span className="fw-bold">{dashboardStats.weeklyProgress}%</span>
                </div>
                <ProgressBar 
                  variant="primary" 
                  now={dashboardStats.weeklyProgress} 
                  style={{ height: '8px' }}
                />
              </div>

              <h6 className="mb-3">Quick Actions</h6>
              <Row>
                <Col md={6} className="mb-3">
                  <Button 
                    variant="outline-primary" 
                    className="w-100 d-flex align-items-center justify-content-center py-3"
                    href="/SecureNeat/chat"
                  >
                    <RiRobotLine className="me-2" />
                    Start AI Chat Session
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button 
                    variant="outline-success" 
                    className="w-100 d-flex align-items-center justify-content-center py-3"
                    href="/SecureNeat/mcq-practice"
                  >
                    <RiQuestionLine className="me-2" />
                    Practice MCQs
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button 
                    variant="outline-info" 
                    className="w-100 d-flex align-items-center justify-content-center py-3"
                    href="/SecureNeat/osce-scenario"
                  >
                    <RiAwardLine className="me-2" />
                    OSCE Scenarios
                  </Button>
                </Col>
                <Col md={6} className="mb-3">
                  <Button 
                    variant="outline-warning" 
                    className="w-100 d-flex align-items-center justify-content-center py-3"
                    href="/SecureNeat/profile"
                  >
                    <RiUserLine className="me-2" />
                    View Profile
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar Content */}
        <Col lg={4}>
          {/* Recent Activities */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <Card.Title className="mb-0">Recent Activities</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className={`p-3 ${index < recentActivities.length - 1 ? 'border-bottom' : ''}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fs-6">{activity.activity}</h6>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                    {activity.score && (
                      <Badge 
                        bg={activity.score >= 80 ? 'success' : activity.score >= 60 ? 'warning' : 'danger'}
                        pill
                      >
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>

          {/* Upcoming Exams */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <Card.Title className="mb-0">
                <RiCalendarLine className="me-2" />
                Upcoming Exams
              </Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              {upcomingExams.map((exam, index) => (
                <div key={index} className={`p-3 ${index < upcomingExams.length - 1 ? 'border-bottom' : ''}`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fs-6">{exam.name}</h6>
                      <small className="text-muted">{exam.date}</small>
                    </div>
                    <Badge bg="primary" pill>
                      {exam.daysLeft} days
                    </Badge>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Message */}
      <div className="mt-4 p-3 bg-success bg-opacity-10 border border-success border-opacity-25 rounded">
        <div className="d-flex align-items-center">
          <div className="text-success me-2">✅</div>
          <div>
            <strong>Access Granted!</strong> You now have full access to all SecureNeat features without any subscription restrictions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSecureNeatDashboard;
