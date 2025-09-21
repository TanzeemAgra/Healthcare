/**
 * TimeTracker.jsx
 * 
 * Advanced time tracking component for monitoring user session time,
 * active time, and monthly time-based analytics.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Table, ProgressBar } from 'react-bootstrap';
import { 
  FaClock, 
  FaPlay, 
  FaPause, 
  FaStop, 
  FaCalendarAlt, 
  FaChartPie,
  FaHistory,
  FaUserClock,
  FaStopwatch
} from 'react-icons/fa';
import axios from 'axios';

const TimeTracker = ({ userId }) => {
  // Time tracking state
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [currentSessionTime, setCurrentSessionTime] = useState(0);
  const [totalDailyTime, setTotalDailyTime] = useState(0);
  const [totalMonthlyTime, setTotalMonthlyTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Analytics state
  const [timeAnalytics, setTimeAnalytics] = useState({
    today: { active_time: 0, sessions: 0, avg_session: 0 },
    week: { active_time: 0, sessions: 0, avg_session: 0, daily_avg: 0 },
    month: { active_time: 0, sessions: 0, avg_session: 0, daily_avg: 0, billing_hours: 0 }
  });
  
  // UI state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  
  // Refs for tracking
  const intervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const idleTimeoutRef = useRef(null);
  
  // Configuration
  const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const TICK_INTERVAL = 1000; // 1 second
  const BILLING_RATE_PER_HOUR = 25; // $25 per hour

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Track time usage in backend
  const trackTimeUsage = async (duration, sessionType = 'active_session') => {
    try {
      await axios.post(
        '/api/usage/track/',
        {
          metric_code: 'active_time_minutes',
          category_code: 'time_tracking',
          event_type: 'time_session',
          metadata: {
            duration_minutes: Math.round(duration / 60000),
            session_type: sessionType,
            timestamp: new Date().toISOString()
          }
        },
        getAuthHeaders()
      );
    } catch (error) {
      console.error('Error tracking time usage:', error);
    }
  };

  // Fetch time analytics
  const fetchTimeAnalytics = useCallback(async () => {
    try {
      const response = await axios.get(
        '/api/usage/analytics/?days=30',
        getAuthHeaders()
      );
      
      const data = response.data;
      
      // Calculate time-specific analytics
      const timeMetrics = data.top_metrics?.find(m => m.metric_code === 'active_time_minutes') || {};
      const todayTime = data.daily_trends?.[data.daily_trends.length - 1]?.total_count || 0;
      const weekTime = data.daily_trends?.slice(-7).reduce((sum, day) => sum + (day.total_count || 0), 0) || 0;
      const monthTime = data.total_usage || 0;
      
      setTimeAnalytics({
        today: {
          active_time: todayTime * 60000, // Convert minutes to milliseconds
          sessions: Math.ceil(todayTime / 30), // Estimate sessions (30 min avg)
          avg_session: todayTime > 0 ? (todayTime * 60000) / Math.max(1, Math.ceil(todayTime / 30)) : 0
        },
        week: {
          active_time: weekTime * 60000,
          sessions: Math.ceil(weekTime / 30),
          avg_session: weekTime > 0 ? (weekTime * 60000) / Math.max(1, Math.ceil(weekTime / 30)) : 0,
          daily_avg: weekTime * 60000 / 7
        },
        month: {
          active_time: monthTime * 60000,
          sessions: Math.ceil(monthTime / 30),
          avg_session: monthTime > 0 ? (monthTime * 60000) / Math.max(1, Math.ceil(monthTime / 30)) : 0,
          daily_avg: monthTime * 60000 / 30,
          billing_hours: monthTime / 60 // Convert minutes to hours for billing
        }
      });
      
      setTotalMonthlyTime(monthTime * 60000);
      setTotalDailyTime(todayTime * 60000);
      
    } catch (error) {
      console.error('Error fetching time analytics:', error);
    }
  }, []);

  // Start session tracking
  const startSession = useCallback(() => {
    if (!isActive) {
      const now = Date.now();
      setSessionStartTime(now);
      setIsActive(true);
      setIsPaused(false);
      lastActivityRef.current = now;
      
      // Start the timer
      intervalRef.current = setInterval(() => {
        setCurrentSessionTime(prevTime => {
          const newTime = prevTime + TICK_INTERVAL;
          
          // Track every 5 minutes
          if (newTime > 0 && newTime % (5 * 60 * 1000) === 0) {
            trackTimeUsage(5 * 60 * 1000, 'active_session');
          }
          
          return newTime;
        });
      }, TICK_INTERVAL);
    }
  }, [isActive]);

  // Pause session
  const pauseSession = useCallback(() => {
    if (isActive && !isPaused) {
      setIsPaused(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isActive, isPaused]);

  // Resume session
  const resumeSession = useCallback(() => {
    if (isActive && isPaused) {
      setIsPaused(false);
      lastActivityRef.current = Date.now();
      
      intervalRef.current = setInterval(() => {
        setCurrentSessionTime(prevTime => prevTime + TICK_INTERVAL);
      }, TICK_INTERVAL);
    }
  }, [isActive, isPaused]);

  // Stop session
  const stopSession = useCallback(() => {
    if (isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Track the final session time
      if (currentSessionTime > 0) {
        trackTimeUsage(currentSessionTime, 'completed_session');
      }
      
      setIsActive(false);
      setIsPaused(false);
      setCurrentSessionTime(0);
      setSessionStartTime(null);
      
      // Refresh analytics
      setTimeout(fetchTimeAnalytics, 1000);
    }
  }, [isActive, currentSessionTime, fetchTimeAnalytics]);

  // Handle user activity (reset idle timer)
  const handleActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    if (isActive && !isPaused) {
      idleTimeoutRef.current = setTimeout(() => {
        pauseSession();
      }, IDLE_TIMEOUT);
    }
  }, [isActive, isPaused, pauseSession]);

  // Auto-start session on component mount
  useEffect(() => {
    startSession();
    fetchTimeAnalytics();
    
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [startSession, fetchTimeAnalytics, handleActivity]);

  // Format time display
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Format time for hours and minutes only
  const formatTimeHours = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Calculate billing amount
  const calculateBilling = (milliseconds) => {
    const hours = milliseconds / (1000 * 60 * 60);
    return (hours * BILLING_RATE_PER_HOUR).toFixed(2);
  };

  // Get status color
  const getStatusColor = () => {
    if (!isActive) return 'secondary';
    if (isPaused) return 'warning';
    return 'success';
  };

  // Get status text
  const getStatusText = () => {
    if (!isActive) return 'Stopped';
    if (isPaused) return 'Paused';
    return 'Active';
  };

  return (
    <div className="time-tracker">
      {/* Current Session Display */}
      <Row className="mb-4">
        <Col>
          <Card className="text-center">
            <Card.Body>
              <div className="d-flex justify-content-center align-items-center mb-3">
                <FaClock className="text-primary me-3" size={48} />
                <div>
                  <h2 className="mb-0">{formatTime(currentSessionTime)}</h2>
                  <Badge bg={getStatusColor()} className="mt-1">
                    {getStatusText()}
                  </Badge>
                </div>
              </div>
              
              <div className="d-flex justify-content-center gap-2">
                {!isActive ? (
                  <Button variant="success" onClick={startSession}>
                    <FaPlay className="me-1" /> Start Session
                  </Button>
                ) : (
                  <>
                    {isPaused ? (
                      <Button variant="success" onClick={resumeSession}>
                        <FaPlay className="me-1" /> Resume
                      </Button>
                    ) : (
                      <Button variant="warning" onClick={pauseSession}>
                        <FaPause className="me-1" /> Pause
                      </Button>
                    )}
                    <Button variant="danger" onClick={stopSession}>
                      <FaStop className="me-1" /> Stop
                    </Button>
                  </>
                )}
                <Button variant="outline-primary" onClick={() => setShowDetails(true)}>
                  <FaHistory className="me-1" /> Details
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Time Analytics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaUserClock className="text-primary mb-2" size={32} />
              <h6 className="text-muted">Today's Time</h6>
              <h4>{formatTimeHours(timeAnalytics.today.active_time)}</h4>
              <small className="text-success">
                ${calculateBilling(timeAnalytics.today.active_time)}
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaStopwatch className="text-info mb-2" size={32} />
              <h6 className="text-muted">Weekly Average</h6>
              <h4>{formatTimeHours(timeAnalytics.week.daily_avg)}</h4>
              <small className="text-muted">
                {Math.round(timeAnalytics.week.sessions / 7)} sessions/day
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaCalendarAlt className="text-warning mb-2" size={32} />
              <h6 className="text-muted">Monthly Total</h6>
              <h4>{formatTimeHours(timeAnalytics.month.active_time)}</h4>
              <small className="text-success">
                ${calculateBilling(timeAnalytics.month.active_time)}
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-center">
              <FaChartPie className="text-success mb-2" size={32} />
              <h6 className="text-muted">Avg Session</h6>
              <h4>{formatTimeHours(timeAnalytics.month.avg_session)}</h4>
              <small className="text-muted">
                {timeAnalytics.month.sessions} sessions
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Monthly Progress */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h6 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Monthly Time Progress
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-2">
                <small>Hours this month: {(timeAnalytics.month.active_time / (1000 * 60 * 60)).toFixed(1)}h</small>
                <small>Target: 160h (Full-time)</small>
              </div>
              <ProgressBar 
                now={(timeAnalytics.month.active_time / (1000 * 60 * 60)) / 160 * 100} 
                variant={
                  (timeAnalytics.month.active_time / (1000 * 60 * 60)) >= 160 ? 'success' :
                  (timeAnalytics.month.active_time / (1000 * 60 * 60)) >= 120 ? 'warning' : 'info'
                }
                style={{ height: '10px' }}
              />
              
              <Row className="mt-3">
                <Col md={6}>
                  <small className="text-muted">
                    <strong>Daily Average:</strong> {(timeAnalytics.month.daily_avg / (1000 * 60 * 60)).toFixed(1)}h
                  </small>
                </Col>
                <Col md={6}>
                  <small className="text-muted">
                    <strong>Monthly Billing:</strong> ${calculateBilling(timeAnalytics.month.active_time)}
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Time Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaHistory className="me-2" />
            Time Tracking Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-4">
            <Col>
              <div className="text-center">
                <h5>Current Session</h5>
                <div className="d-flex justify-content-center align-items-center">
                  <FaClock size={24} className="me-2 text-primary" />
                  <span className="h4">{formatTime(currentSessionTime)}</span>
                  <Badge bg={getStatusColor()} className="ms-2">
                    {getStatusText()}
                  </Badge>
                </div>
                {sessionStartTime && (
                  <small className="text-muted">
                    Started: {new Date(sessionStartTime).toLocaleTimeString()}
                  </small>
                )}
              </div>
            </Col>
          </Row>
          
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Period</th>
                <th>Active Time</th>
                <th>Sessions</th>
                <th>Avg Session</th>
                <th>Billing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Today</strong></td>
                <td>{formatTimeHours(timeAnalytics.today.active_time)}</td>
                <td>{timeAnalytics.today.sessions}</td>
                <td>{formatTimeHours(timeAnalytics.today.avg_session)}</td>
                <td>${calculateBilling(timeAnalytics.today.active_time)}</td>
              </tr>
              <tr>
                <td><strong>This Week</strong></td>
                <td>{formatTimeHours(timeAnalytics.week.active_time)}</td>
                <td>{timeAnalytics.week.sessions}</td>
                <td>{formatTimeHours(timeAnalytics.week.avg_session)}</td>
                <td>${calculateBilling(timeAnalytics.week.active_time)}</td>
              </tr>
              <tr>
                <td><strong>This Month</strong></td>
                <td>{formatTimeHours(timeAnalytics.month.active_time)}</td>
                <td>{timeAnalytics.month.sessions}</td>
                <td>{formatTimeHours(timeAnalytics.month.avg_session)}</td>
                <td>${calculateBilling(timeAnalytics.month.active_time)}</td>
              </tr>
            </tbody>
          </Table>
          
          <div className="mt-3">
            <h6>Time Tracking Features:</h6>
            <ul className="list-unstyled">
              <li>✅ Automatic activity detection</li>
              <li>✅ Idle time pause (5 minutes)</li>
              <li>✅ Session management</li>
              <li>✅ Monthly billing calculation</li>
              <li>✅ Real-time tracking</li>
              <li>✅ Analytics and reporting</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={fetchTimeAnalytics}>
            Refresh Data
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimeTracker;
