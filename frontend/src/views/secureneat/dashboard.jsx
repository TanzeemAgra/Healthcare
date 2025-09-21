import React from 'react';
import { Row, Col, ProgressBar, Button, Badge, ListGroup } from 'react-bootstrap';
import Card from '../../components/Card'; // Assuming Card component is in ../../components/Card
import Chart from 'react-apexcharts'; // For the top chart
import SubscriptionGate from '../../components/SubscriptionGate';
import ProtectedRoute from '../../components/common/ProtectedRoute';
// import { Link } from 'react-router-dom'; // Uncomment if "View All" needs to be a router Link

const SecureNeatDashboard = () => {
    // Chart Data for Weekly Progress
    const weeklyProgressOptions = {
        chart: {
            type: 'bar',
            height: 320, // Adjusted height
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '45%', // Adjusted column width
                endingShape: 'rounded',
                borderRadius: 5,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent'],
        },
        series: [{
            name: 'Progress',
            data: [70, 80, 60, 90, 75] // Example data for Wed, Thu, Fri, Sat, Sun
        }],
        xaxis: {
            categories: ['Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            labels: {
                style: {
                    colors: '#6c757d', // Muted text color for labels
                    fontSize: '12px',
                },
            },
        },
        yaxis: {
            title: {
                text: '% Progress',
                style: {
                    color: '#6c757d',
                    fontSize: '12px',
                }
            },
            min: 0,
            max: 100,
            tickAmount: 5,
            labels: {
                formatter: function (val) {
                    return val + "%";
                },
                style: {
                    colors: '#6c757d',
                    fontSize: '12px',
                },
            }
        },
        fill: {
            opacity: 1,
            colors: ['#089bab'] // Primary color for bars
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + "%";
                }
            }
        },
        grid: {
            borderColor: '#e0e0e0', // Lighter grid color
            strokeDashArray: 4,
        }
    };

    // Recent Activity Data
    const recentActivities = [
        { title: "Cardiology", type: "MCQ", progress: 85, time: "2h ago", color: "primary" },
        { title: "Patient Examination", type: "OSCE", progress: 92, time: "1d ago", color: "success" },
        { title: "Neurology", type: "Study", duration: "2h", time: "2d ago", color: "info" },
    ];

    // Performance Breakdown Data
    const strongestTopics = [
        { name: "Respiratory", progress: 92, variant: "success" },
        { name: "Gastroenterology", progress: 92, variant: "success" },
    ];

    const areasForImprovement = [
        { name: "Cardiology", progress: 65, variant: "warning" },
        { name: "Neurology", progress: 65, variant: "warning" },
    ];

    // Today's Study Plan Data
    const studyPlan = [
        { task: "Cardiology Review", time: "09:00", duration: "2h", status: "Completed" },
        { task: "OSCE Practice", time: "11:30", duration: "1.5h", status: "Start" },
        { task: "MCQ Session", time: "14:00", duration: "1h", status: "Start" },
        { task: "Case Studies", time: "16:00", duration: "2h", status: "Start" },
    ];

    // Upcoming Exams Data
    const upcomingExams = [
        { name: "PLAB Part 1", date: "2024-06-15", daysLeft: 45 },
        { name: "USMLE Step 1", date: "2024-08-20", daysLeft: 111 },
        { name: "MRCP Part 1", date: "2024-09-05", daysLeft: 127 },
    ];

    return (
        <SubscriptionGate serviceName="Dr. Max AI Chatbot">
        <>
            <Row>
                {/* Top Chart Column */}
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card>
                        <Card.Header>
                            <Card.Header.Title>
                                <h4 className="card-title">Weekly Progress</h4>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            <Chart
                                options={weeklyProgressOptions}
                                series={weeklyProgressOptions.series}
                                type="bar"
                                height={weeklyProgressOptions.chart.height}
                            />
                        </Card.Body>
                    </Card>
                </Col>

                {/* Recent Activity Column */}
                <Col lg={4}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Header.Title>
                                <h4 className="card-title mb-0">Recent Activity</h4>
                            </Card.Header.Title>
                            <Button variant="link" size="sm" className="text-primary p-0">View All</Button>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {recentActivities.map((activity, index) => (
                                    <ListGroup.Item key={index} className="px-0 border-0 pt-2 pb-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1">{activity.title} <Badge bg={`${activity.color}-subtle`} text={activity.color} pill className="ms-1">{activity.type}</Badge></h6>
                                                {activity.progress ? (
                                                    <small className="text-muted">{activity.progress}% • {activity.time}</small>
                                                ) : (
                                                    <small className="text-muted">{activity.duration} • {activity.time}</small>
                                                )}
                                            </div>
                                            {activity.progress && <ProgressBar now={activity.progress} style={{ width: '50px', height: '6px' }} variant={activity.color} />}
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                {/* Stats Cards Column */}
                <Col lg={4} className="mb-4 mb-lg-0">
                    <Row>
                        <Col md={12} className="mb-4">
                             <Card>
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle card-icon bg-primary-subtle text-primary me-3" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ri-questionnaire-line ri-xl"></i>
                                        </div>
                                        <div>
                                            <h2 className="mb-0 fw-bold">450</h2>
                                            <p className="mb-0 text-muted">Total Questions</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={12}>
                            <Card>
                                <Card.Body>
                                    <div className="d-flex align-items-center">
                                        <div className="rounded-circle card-icon bg-success-subtle text-success me-3" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className="ri-check-double-line ri-xl"></i>
                                        </div>
                                        <div>
                                            <h2 className="mb-0 fw-bold">369</h2>
                                            <p className="mb-0 text-muted">Correct Answers</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Performance Breakdown Column */}
                <Col lg={8}>
                    <Card>
                        <Card.Header>
                            <Card.Header.Title>
                                <h4 className="card-title">Performance Breakdown</h4>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3 mb-md-0">
                                    <h6 className="mb-3">Strongest Topics</h6>
                                    {strongestTopics.map((topic, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="text-muted">{topic.name}</span>
                                                <span className={`text-${topic.variant}`}>{topic.progress}%</span>
                                            </div>
                                            <ProgressBar now={topic.progress} variant={topic.variant} style={{ height: '8px' }} />
                                        </div>
                                    ))}
                                </Col>
                                <Col md={6}>
                                    <h6 className="mb-3">Areas for Improvement</h6>
                                    {areasForImprovement.map((topic, index) => (
                                        <div key={index} className="mb-3">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="text-muted">{topic.name}</span>
                                                <span className={`text-${topic.variant}`}>{topic.progress}%</span>
                                            </div>
                                            <ProgressBar now={topic.progress} variant={topic.variant} style={{ height: '8px' }} />
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                {/* Today's Study Plan Column */}
                <Col lg={7} className="mb-4 mb-lg-0">
                    <Card>
                        <Card.Header>
                            <Card.Header.Title>
                                <h4 className="card-title">Today's Study Plan</h4>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {studyPlan.map((item, index) => (
                                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center px-0 py-3">
                                        <div>
                                            <h6 className="mb-1">{item.task}</h6>
                                            <small className="text-muted">{item.time} • {item.duration}</small>
                                        </div>
                                        {item.status === "Completed" ? (
                                            <Badge bg="success-subtle" text="success" pill>Completed</Badge>
                                        ) : (
                                            <Button variant="primary-subtle" size="sm">Start</Button>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Upcoming Exams Column */}
                <Col lg={5}>
                    <Card>
                        <Card.Header>
                            <Card.Header.Title>
                                <h4 className="card-title">Upcoming Exams</h4>
                            </Card.Header.Title>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                {upcomingExams.map((exam, index) => (
                                    <ListGroup.Item key={index} className="px-0 border-0 py-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h6 className="mb-1">{exam.name}</h6>
                                            <Badge bg="info-subtle" text="info" pill>{exam.daysLeft} days left</Badge>
                                        </div>
                                        <small className="text-muted">Date: {exam.date}</small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
        </SubscriptionGate>
    );
};

// Wrap the component with protection
const ProtectedSecureNeatDashboard = () => {
    return (
        <ProtectedRoute 
            permission="canAccessSecureNeatModule" 
            moduleName="SecureNeat Module"
        >
            <SecureNeatDashboard />
        </ProtectedRoute>
    );
};

export default ProtectedSecureNeatDashboard;