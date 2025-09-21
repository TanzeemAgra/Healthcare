import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Dermatology Components
import DermatologyS3DataManager from '../views/dermatology/DermatologyS3DataManager';
import DermatologyPatients_FINAL from '../views/dermatology/DermatologyPatients_FINAL';
import DermatologyPatient from '../views/dermatology/DermatologyPatient';

const DermatologyRouter = () => {
  return (
    <Routes>
      {/* Main S3 Data Manager Route */}
      <Route 
        path="/" 
        element={<DermatologyS3DataManager />} 
      />
      
      {/* S3 Data Manager with specific tabs */}
      <Route 
        path="/dashboard" 
        element={<DermatologyS3DataManager />} 
      />
      
      <Route 
        path="/institutions" 
        element={<DermatologyS3DataManager />} 
      />
      
      <Route 
        path="/patients" 
        element={<DermatologyS3DataManager />} 
      />
      
      <Route 
        path="/medical-records" 
        element={<DermatologyS3DataManager />} 
      />
      
      {/* Legacy Patient Management Routes */}
      <Route 
        path="/patients-legacy" 
        element={<DermatologyPatients_FINAL />} 
      />
      
      <Route 
        path="/patient/:id" 
        element={<DermatologyPatient />} 
      />
      
      {/* Redirect old routes to new S3 manager */}
      <Route 
        path="/management" 
        element={<Navigate to="/dermatology/" replace />} 
      />
    </Routes>
  );
};

export default DermatologyRouter;
