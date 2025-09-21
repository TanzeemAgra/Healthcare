import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import Contact from '../views/contact/Contact';
import Management from '../views/admin/Management';
import { useAuth } from '../hooks/useAuth'; // You'll need to create this hook

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<DefaultLayout />}>
          <Route path="contact" element={<Contact />} />
          
          {/* Protected Admin Routes */}
          <Route
            path="admin/management"
            element={
              <ProtectedRoute>
                <Management />
              </ProtectedRoute>
            }
          />
          
          {/* Landing page as home route */}
          <Route path="/" element={<LandingPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
