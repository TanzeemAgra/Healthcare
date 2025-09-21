import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../views/UserProfile';

const ProfileRouter = () => {
  const { user, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Show the profile overview page for all authenticated users
  // This gives users a central place to see their info and navigate to specific profiles
  return <UserProfile />;
};

export default ProfileRouter;
