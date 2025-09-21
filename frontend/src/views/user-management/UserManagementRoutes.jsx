/**
 * User Management Routes
 * Routing configuration for user management system
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EnhancedUserManagement from './EnhancedUserManagement';
import UserManagement from './UserManagement';
import UserManagementSimple from './UserManagementSimple';
import StandaloneAdminPage from '../StandaloneAdminPage';

const UserManagementRoutes = () => {
    return (
        <Routes>
            {/* Main enhanced user management */}
            <Route path="/" element={<EnhancedUserManagement />} />
            <Route path="/enhanced" element={<EnhancedUserManagement />} />
            
            {/* Alternative user management interfaces */}
            <Route path="/standard" element={<UserManagement />} />
            <Route path="/simple" element={<UserManagementSimple />} />
            <Route path="/standalone" element={<StandaloneAdminPage />} />
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/user-management" replace />} />
        </Routes>
    );
};

export default UserManagementRoutes;
