/**
 * ClockCounter.jsx
 * 
 * Minimal clock counter widget that can be embedded anywhere
 * to show current session time and monthly totals.
 */

import React, { useState, useEffect } from 'react';
import { Badge, Card } from 'react-bootstrap';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

const ClockCounter = ({ 
  position = 'fixed', 
  top = '20px', 
  right = '20px',
  showMonthly = true,
  compact = false 
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [sessionStart, setSessionStart] = useState(null);
  const [monthlyTime, setMonthlyTime] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const startTime = Date.now();
    setSessionStart(startTime);
    
    // Get monthly time from localStorage or API
    const savedMonthlyTime = localStorage.getItem('monthlyActiveTime') || 0;
    setMonthlyTime(parseInt(savedMonthlyTime));
  }, []);

  // Update timer every second
  useEffect(() => {
    if (!isActive || !sessionStart) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now() - sessionStart);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, sessionStart]);

  // Save to localStorage periodically
  useEffect(() => {
    if (currentTime > 0 && currentTime % 60000 === 0) { // Every minute
      const newMonthlyTime = monthlyTime + 60000;
      setMonthlyTime(newMonthlyTime);
      localStorage.setItem('monthlyActiveTime', newMonthlyTime.toString());
    }
  }, [currentTime, monthlyTime]);

  // Handle visibility change (pause when tab not active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Format time to HH:MM:SS or MM:SS
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format time for monthly display (hours and minutes)
  const formatMonthlyTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const containerStyle = {
    position,
    top,
    right,
    zIndex: 1000,
    minWidth: compact ? '120px' : '200px'
  };

  if (compact) {
    return (
      <div style={containerStyle}>
        <Badge bg={isActive ? 'success' : 'secondary'} className="p-2 d-flex align-items-center">
          <FaClock className="me-1" />
          {formatTime(currentTime)}
        </Badge>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Card className="shadow-sm">
        <Card.Body className="p-3">
          <div className="text-center">
            <div className="d-flex align-items-center justify-content-center mb-2">
              <FaClock className={`me-2 ${isActive ? 'text-success' : 'text-secondary'}`} />
              <span className="fw-bold">{formatTime(currentTime)}</span>
              <Badge bg={isActive ? 'success' : 'secondary'} className="ms-2" size="sm">
                {isActive ? 'LIVE' : 'PAUSED'}
              </Badge>
            </div>
            
            {showMonthly && (
              <div className="small text-muted">
                <FaCalendarAlt className="me-1" />
                Month: {formatMonthlyTime(monthlyTime)}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ClockCounter;
