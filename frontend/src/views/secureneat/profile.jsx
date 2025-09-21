import React from "react";
import { Button, Col, Form, Nav, Row, Tab, Image, Container, Badge, ProgressBar } from "react-bootstrap";
import Card from "../../components/Card"; // Assuming Card component path

// Placeholder user image - replace with actual logic
import userPlaceholder from "/assets/images/user/11.png"; // Using an existing image from your components

const SecureNeatProfile = () => {
    // Sample user data - replace with actual data from state or props
    const userData = {
        firstName: "Bess",
        lastName: "Willis",
        username: "bess.willis",
        email: "bess.willis@example.com",
        city: "California",
        country: "USA",
        bio: "Dedicated medical professional with a passion for learning and continuous improvement. Focused on acing PLAB, USMLE, and MRCP exams.",
        profilePic: userPlaceholder,
        examProgress: [
            { name: "PLAB Part 1", progress: 75, status: "Preparing" },
            { name: "USMLE Step 1", progress: 40, status: "Scheduled" },
            { name: "MRCP Part 1", progress: 10, status: "Planning" },
        ]
    };

    return (
        <Container fluid>
            <Row>
                <Tab.Container defaultActiveKey={'personal-information'}>
                    <Col lg={12}>
                        <Card>
                            <Card.Body className="p-0">
                                <Nav as="ul" variant="pills" className="edit-profile nav-fill mb-0 flex-md-row flex-column" role="tablist">
                                    <Nav.Item as="li" className="p-0">
                                        <Nav.Link eventKey="personal-information" className="py-3 text-center">
                                            Personal Information
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="p-0">
                                        <Nav.Link eventKey="account-settings" className="py-3 text-center">
                                            Account Settings
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="p-0">
                                        <Nav.Link eventKey="exam-progress" className="py-3 text-center">
                                            Exam Progress
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item as="li" className="p-0">
                                        <Nav.Link eventKey="subscription" className="py-3 text-center">
                                            Subscription
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={12}>
                        <div className="edit-list-data">
                            <Tab.Content>
                                <Tab.Pane eventKey="personal-information">
                                    <Card>
                                        <Card.Header>
                                            <Card.Header.Title>
                                                <h4 className="card-title">Personal Information</h4>
                                            </Card.Header.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Row className="align-items-center mb-4">
                                                    <Col md={12} className="text-center">
                                                        <div className="profile-img-edit position-relative d-inline-block">
                                                            <Image className="profile-pic rounded-circle img-fluid" src={userData.profilePic} alt="profile-pic" style={{ width: "150px", height: "150px", objectFit: "cover" }} />
                                                            <div className="p-image bg-primary-subtle rounded-circle" style={{position: 'absolute', bottom: '5px', right: '5px', cursor: 'pointer', padding: '0.5rem'}}>
                                                                <i className="ri-pencil-line upload-button text-primary"></i>
                                                                <input className="file-upload d-none" type="file" accept="image/*" />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row className="cust-form-input">
                                                    <Col sm={6} className="form-group mb-3">
                                                        <Form.Label htmlFor="fname" className="mb-1">First Name:</Form.Label>
                                                        <Form.Control type="text" id="fname" defaultValue={userData.firstName} />
                                                    </Col>
                                                    <Col sm={6} className="form-group mb-3">
                                                        <Form.Label htmlFor="lname" className="mb-1">Last Name:</Form.Label>
                                                        <Form.Control type="text" id="lname" defaultValue={userData.lastName} />
                                                    </Col>
                                                    <Col sm={6} className="form-group mb-3">
                                                        <Form.Label htmlFor="uname" className="mb-1">Username:</Form.Label>
                                                        <Form.Control type="text" id="uname" defaultValue={userData.username} />
                                                    </Col>
                                                    <Col sm={6} className="form-group mb-3">
                                                        <Form.Label htmlFor="email" className="mb-1">Email:</Form.Label>
                                                        <Form.Control type="email" id="email" defaultValue={userData.email} />
                                                    </Col>
                                                    <Col sm={6} className="form-group mb-3">
                                                        <Form.Label htmlFor="city" className="mb-1">City:</Form.Label>
                                                        <Form.Control type="text" id="city" defaultValue={userData.city} />
                                                    </Col>
                                                    <Col sm={6} className="form-group mb-3">
                                                        <Form.Label htmlFor="country" className="mb-1">Country:</Form.Label>
                                                        <Form.Control type="text" id="country" defaultValue={userData.country} />
                                                    </Col>
                                                    <Col sm={12} className="form-group mb-3">
                                                        <Form.Label htmlFor="bio" className="mb-1">Bio:</Form.Label>
                                                        <Form.Control as="textarea" id="bio" rows={4} defaultValue={userData.bio} />
                                                    </Col>
                                                </Row>
                                                <Button type="submit" variant="primary-subtle" className="me-2 mt-3">Save Changes</Button>
                                                <Button type="reset" variant="danger-subtle" className="mt-3">Cancel</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>

                                <Tab.Pane eventKey="account-settings">
                                    <Card>
                                        <Card.Header>
                                            <Card.Header.Title>
                                                <h4 className="card-title">Account Settings</h4>
                                            </Card.Header.Title>
                                        </Card.Header>
                                        <Card.Body className="cust-form-input">
                                            <Form>
                                                <Form.Group className="form-group mb-3">
                                                    <Form.Label htmlFor="cpass" className="mb-1">Current Password:</Form.Label>
                                                    <Form.Control type="password" id="cpass" placeholder="Enter current password" />
                                                </Form.Group>
                                                <Form.Group className="form-group mb-3">
                                                    <Form.Label htmlFor="npass" className="mb-1">New Password:</Form.Label>
                                                    <Form.Control type="password" id="npass" placeholder="Enter new password" />
                                                </Form.Group>
                                                <Form.Group className="form-group mb-3">
                                                    <Form.Label htmlFor="vpass" className="mb-1">Verify Password:</Form.Label>
                                                    <Form.Control type="password" id="vpass" placeholder="Confirm new password" />
                                                </Form.Group>
                                                <hr/>
                                                <h5 className="mb-3">Notifications</h5>
                                                <Form.Check type="switch" id="email-notifications" label="Email Notifications" className="mb-2" defaultChecked/>
                                                <Form.Check type="switch" id="sms-notifications" label="SMS Notifications" className="mb-3"/>
                                                
                                                <Button type="submit" variant="primary-subtle" className="me-2 mt-3">Update Settings</Button>
                                                <Button type="reset" variant="danger-subtle" className="mt-3">Cancel</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>

                                <Tab.Pane eventKey="exam-progress">
                                    <Card>
                                        <Card.Header>
                                            <Card.Header.Title>
                                                <h4 className="card-title">Exam Progress & Goals</h4>
                                            </Card.Header.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            {userData.examProgress.map((exam, index) => (
                                                <div key={index} className="mb-4">
                                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                                        <h6 className="mb-0">{exam.name}</h6>
                                                        <Badge bg="info-subtle" text="info">{exam.status}</Badge>
                                                    </div>
                                                    <ProgressBar now={exam.progress} label={`${exam.progress}%`} variant="primary" style={{height: '10px'}} />
                                                </div>
                                            ))}
                                            <Button variant="primary-subtle" className="mt-3">Set New Goal</Button>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>

                                <Tab.Pane eventKey="subscription">
                                    <Card>
                                        <Card.Header>
                                            <Card.Header.Title>
                                                <h4 className="card-title">Subscription Details</h4>
                                            </Card.Header.Title>
                                        </Card.Header>
                                        <Card.Body>
                                            <p><strong>Current Plan:</strong> Premium Monthly</p>
                                            <p><strong>Next Billing Date:</strong> 2024-07-15</p>
                                            <p><strong>Amount:</strong> $29.99/month</p>
                                            <hr/>
                                            <Button variant="success-subtle" className="me-2">Upgrade Plan</Button>
                                            <Button variant="danger-subtle">Cancel Subscription</Button>
                                            <Button variant="outline-secondary" className="ms-2">View Billing History</Button>
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                    </Col>
                </Tab.Container>
            </Row>
        </Container>
    );
};

export default SecureNeatProfile;