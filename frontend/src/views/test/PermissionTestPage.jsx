import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';
import SimplePermissionDebugger from '../../components/debug/SimplePermissionDebugger';

const PermissionTestPage = () => {
  const permissions = usePermissions();
  
  const testStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  };
  
  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  return (
    <div style={testStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>🧬 DNA Sequencing Permission Test</h1>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Quick Permission Check:</h3>
          <p><strong>Can Access DNA Sequencing:</strong> {
            permissions.canAccessDnaSequencingModule?.() ? 
            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ YES</span> : 
            <span style={{ color: 'red', fontWeight: 'bold' }}>❌ NO</span>
          }</p>
          <p><strong>DNA Sequencing Feature Enabled:</strong> {
            permissions.hasDashboardFeature?.('dna_sequencing_module') ? 
            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ YES</span> : 
            <span style={{ color: 'red', fontWeight: 'bold' }}>❌ NO</span>
          }</p>
          <p><strong>Is Super Admin:</strong> {
            permissions.isSuperAdmin?.() ? 
            <span style={{ color: 'green', fontWeight: 'bold' }}>✅ YES</span> : 
            <span style={{ color: 'red', fontWeight: 'bold' }}>❌ NO</span>
          }</p>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderLeft: '4px solid #007bff', marginBottom: '20px' }}>
          <h4>Test Instructions:</h4>
          <ol>
            <li>Make sure you are logged in as a super admin</li>
            <li>Check that all three items above show "✅ YES"</li>
            <li>If any show "❌ NO", check the detailed debugger below</li>
            <li>Try navigating to <code>/dna-sequencing/dashboard</code></li>
          </ol>
        </div>
        
        {!permissions.canAccessDnaSequencingModule?.() && (
          <div style={{ padding: '15px', backgroundColor: '#ffebee', borderLeft: '4px solid #f44336', marginBottom: '20px' }}>
            <h4>❌ Access Denied - Troubleshooting Steps:</h4>
            <ul>
              <li>Check if you are logged in as super_admin (not just admin)</li>
              <li>Verify localStorage contains correct user data</li>
              <li>Check if dna_sequencing_module is in dashboard features</li>
              <li>Review the permission context initialization</li>
            </ul>
          </div>
        )}
        
        {permissions.canAccessDnaSequencingModule?.() && (
          <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderLeft: '4px solid #4caf50', marginBottom: '20px' }}>
            <h4>✅ Access Granted - DNA Sequencing Available!</h4>
            <p>You should be able to access:</p>
            <ul>
              <li>DNA Sequencing Dashboard</li>
              <li>AI Genomics Lab</li>
              <li>All DNA sequencing features</li>
            </ul>
          </div>
        )}
      </div>
      
      <SimplePermissionDebugger />
    </div>
  );
};

export default PermissionTestPage;
