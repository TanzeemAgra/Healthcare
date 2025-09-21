/**
 * Real-time Notification Component - Soft Coded Approach
 * Displays alerts for new patient additions and system updates
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import DASHBOARD_CONFIG from '../../config/dashboardConfig';

// Simple notification hook for state management
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      type: 'info',
      autoHide: true,
      ...notification
    };
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      // Limit notifications to prevent overflow
      if (updated.length > DASHBOARD_CONFIG.notifications.maxVisible) {
        return updated.slice(-DASHBOARD_CONFIG.notifications.maxVisible);
      }
      return updated;
    });

    // Auto-remove notification after configured delay
    if (newNotification.autoHide) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, DASHBOARD_CONFIG.notifications.autoHideDelay);
    }
  }, []);

  const addNewPatientNotification = useCallback((patient) => {
    addNotification({
      type: DASHBOARD_CONFIG.notifications.types.success,
      title: 'New Patient Added',
      message: `${patient.name} has been added to ${patient.department}`,
      patient: patient
    });
  }, [addNotification]);

  const addCriticalNotification = useCallback((patient) => {
    addNotification({
      type: DASHBOARD_CONFIG.notifications.types.error,
      title: 'Critical Patient Alert',
      message: `${patient.name} requires immediate attention`,
      patient: patient,
      autoHide: false
    });
  }, [addNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return {
    notifications,
    addNotification,
    addNewPatientNotification,
    addCriticalNotification,
    removeNotification
  };
};

const NotificationCenter = ({ 
  notifications = [], 
  onDismiss = () => {}, 
  position = 'top-end'
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);
  const config = DASHBOARD_CONFIG.notifications;

  useEffect(() => {
    const newNotifications = notifications.map(notification => ({
      ...notification,
      id: notification.id || Date.now() + Math.random(),
      timestamp: notification.timestamp || new Date().toISOString()
    }));

    setVisibleNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
      return [...prev, ...uniqueNew];
    });
  }, [notifications]);

  const handleDismiss = (notificationId) => {
    setVisibleNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
    onDismiss(notificationId);
  };

  const getNotificationVariant = (type) => {
    const variants = {
      [config.types.success]: 'success',
      [config.types.error]: 'danger', 
      [config.types.warning]: 'warning',
      [config.types.info]: 'info'
    };
    return variants[type] || 'info';
  };

  const getNotificationIcon = (type) => {
    const icons = {
      [config.types.success]: '✅',
      [config.types.error]: '❌',
      [config.types.warning]: '⚠️',
      [config.types.info]: 'ℹ️',
      'new_patient': '👤',
      'critical': '🚨',
      'update': '🔄'
    };
    return icons[type] || 'ℹ️';
  };

  const formatTimestamp = (timestamp) => {
    try {
      const now = new Date();
      const notificationTime = new Date(timestamp);
      const diffMs = now - notificationTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return notificationTime.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <ToastContainer 
      position={position} 
      className="p-3"
      style={{ zIndex: 9999 }}
    >
      {visibleNotifications.map((notification) => (
        <Toast
          key={notification.id}
          onClose={() => handleDismiss(notification.id)}
          show={true}
          autohide={config.autoHide && notification.autoHide !== false}
          delay={config.autoHideDelay}
          className="mb-2"
        >
          <Toast.Header>
            <span className="me-2">{getNotificationIcon(notification.type)}</span>
            <strong className="me-auto">
              {notification.title || 'Notification'}
            </strong>
            <small className="text-muted">
              {formatTimestamp(notification.timestamp)}
            </small>
          </Toast.Header>
          <Toast.Body>
            <div className={`alert alert-${getNotificationVariant(notification.type)} mb-0`}>
              {notification.message}
              {notification.patient && (
                <div className="mt-2 small">
                  <strong>Patient:</strong> {notification.patient.name}<br/>
                  <strong>Department:</strong> {notification.patient.department}<br/>
                  <strong>Status:</strong> {notification.patient.status}
                </div>
              )}
            </div>
          </Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  );
};

export default NotificationCenter;
