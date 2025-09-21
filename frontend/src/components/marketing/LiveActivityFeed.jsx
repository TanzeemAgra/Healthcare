import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'patient_registration',
      message: 'Dr. Sarah Chen registered a new patient',
      hospital: 'St. Mary\'s Hospital',
      time: 'Just now',
      icon: 'ri-user-add-line',
      color: 'success'
    },
    {
      id: 2,
      type: 'diagnosis',
      message: 'AI assisted diagnosis completed for Patient #12847',
      hospital: 'General Medical Center',
      time: '2 minutes ago',
      icon: 'ri-brain-line',
      color: 'info'
    },
    {
      id: 3,
      type: 'report',
      message: 'Radiology report generated automatically',
      hospital: 'City Health Network',
      time: '5 minutes ago',
      icon: 'ri-file-text-line',
      color: 'warning'
    },
    {
      id: 4,
      type: 'appointment',
      message: 'Emergency appointment scheduled',
      hospital: 'Central Hospital',
      time: '8 minutes ago',
      icon: 'ri-calendar-schedule-line',
      color: 'danger'
    },
    {
      id: 5,
      type: 'billing',
      message: 'Insurance claim processed successfully',
      hospital: 'Medicare Plus',
      time: '12 minutes ago',
      icon: 'ri-money-dollar-circle-line',
      color: 'primary'
    }
  ]);

  const [newActivityCount, setNewActivityCount] = useState(0);

  // Simulate new activities
  useEffect(() => {
    const activityTemplates = [
      {
        type: 'patient_registration',
        messages: [
          'Dr. Johnson admitted a new patient',
          'New patient checked in at Emergency',
          'Dr. Williams registered pediatric patient'
        ],
        icon: 'ri-user-add-line',
        color: 'success'
      },
      {
        type: 'diagnosis',
        messages: [
          'AI diagnosis completed for cardiac case',
          'Machine learning model predicted early symptoms',
          'Automated screening flagged high-risk patient'
        ],
        icon: 'ri-brain-line',
        color: 'info'
      },
      {
        type: 'report',
        messages: [
          'Lab results auto-generated',
          'MRI scan report completed',
          'Blood test analysis finished'
        ],
        icon: 'ri-file-text-line',
        color: 'warning'
      },
      {
        type: 'appointment',
        messages: [
          'Follow-up appointment scheduled',
          'Specialist consultation booked',
          'Surgery scheduled for next week'
        ],
        icon: 'ri-calendar-schedule-line',
        color: 'danger'
      },
      {
        type: 'billing',
        messages: [
          'Payment processed automatically',
          'Insurance verification completed',
          'Billing invoice sent to patient'
        ],
        icon: 'ri-money-dollar-circle-line',
        color: 'primary'
      }
    ];

    const hospitals = [
      'St. Mary\'s Hospital',
      'General Medical Center',
      'City Health Network',
      'Central Hospital',
      'Medicare Plus',
      'Regional Medical',
      'University Hospital',
      'Children\'s Medical Center'
    ];

    const interval = setInterval(() => {
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      const message = template.messages[Math.floor(Math.random() * template.messages.length)];
      const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];

      const newActivity = {
        id: Date.now(),
        type: template.type,
        message,
        hospital,
        time: 'Just now',
        icon: template.icon,
        color: template.color
      };

      setActivities(prev => {
        setNewActivityCount(count => count + 1);
        return [newActivity, ...prev.slice(0, 9)]; // Keep only 10 activities
      });

      // Reset new activity count after 3 seconds
      setTimeout(() => {
        setNewActivityCount(0);
      }, 3000);
    }, 4000); // New activity every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Update time stamps
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => 
        prev.map(activity => {
          if (activity.time === 'Just now') {
            return { ...activity, time: '1 minute ago' };
          } else if (activity.time.includes('minute ago')) {
            const minutes = parseInt(activity.time) + 1;
            return { ...activity, time: `${minutes} minutes ago` };
          }
          return activity;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="h-100 shadow-lg border-0" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Card.Header className="border-0 bg-transparent text-white">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="me-2"
            >
              <i className="ri-pulse-line fs-4"></i>
            </motion.div>
            <h6 className="mb-0 fw-bold">Live Activity Feed</h6>
          </div>
          <div className="d-flex align-items-center">
            {newActivityCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="me-2"
              >
                <Badge bg="danger" className="rounded-circle">
                  {newActivityCount}
                </Badge>
              </motion.div>
            )}
            <span className="badge bg-success bg-opacity-25 text-white">
              <i className="ri-record-circle-line me-1"></i>
              LIVE
            </span>
          </div>
        </div>
      </Card.Header>

      <Card.Body className="px-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <div className="activity-feed">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="activity-item px-3 py-2 border-bottom border-light border-opacity-25"
              style={{ 
                background: index === 0 && activity.time === 'Just now' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'transparent' 
              }}
            >
              <div className="d-flex align-items-start">
                <div className="flex-shrink-0 me-3">
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center bg-${activity.color} bg-opacity-25`}
                    style={{ width: '35px', height: '35px' }}
                  >
                    <i className={`${activity.icon} text-white`}></i>
                  </div>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="mb-1 text-white fw-medium" style={{ fontSize: '0.9rem' }}>
                        {activity.message}
                      </p>
                      <small className="text-white-50">
                        <i className="ri-hospital-line me-1"></i>
                        {activity.hospital}
                      </small>
                    </div>
                    <small className="text-white-50 text-nowrap ms-2">
                      {activity.time}
                    </small>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card.Body>

      <Card.Footer className="border-0 bg-transparent">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-white-50">
            <i className="ri-shield-check-line me-1"></i>
            Real-time monitoring active
          </small>
          <Button 
            variant="outline-light" 
            size="sm" 
            className="rounded-pill"
            style={{ fontSize: '0.8rem' }}
          >
            View All Activities
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default LiveActivityFeed;
