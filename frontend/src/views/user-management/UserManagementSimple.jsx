import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tab,
  Tabs
} from 'react-bootstrap';
import { 
  RiUserLine,
  RiUserAddLine,
  RiTeamLine
} from '@remixicon/react';

const UserManagementSimple = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <Container fluid className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">User Management</h2>
          <p className="text-muted mb-0">Manage system users and their permissions</p>
        </div>
        <Button variant="primary">
          <RiUserAddLine size={16} className="me-1" />
          Add New User
        </Button>
      </div>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="overview" title={
          <span className="d-flex align-items-center gap-2">
            <RiTeamLine size={16} />
            Overview
          </span>
        }>
          <Row>
            <Col lg={12}>
              <Card>
                <Card.Body className="text-center py-5">
                  <RiUserLine size={64} className="text-muted mb-3" />
                  <h4 className="text-muted">User Management Overview</h4>
                  <p className="text-muted">User management features are being loaded...</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserManagementSimple;
