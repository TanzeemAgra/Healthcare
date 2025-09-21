import React from 'react';
import { usePermissions } from '../../contexts/PermissionContext';

const SimplePermissionDebugger = () => {
  const permissions = usePermissions();
  
  const getCurrentUser = () => {
    const userFromStorage = localStorage.getItem('user');
    const authFromStorage = localStorage.getItem('auth');
    
    try {
      return {
        fromUser: userFromStorage ? JSON.parse(userFromStorage) : null,
        fromAuth: authFromStorage ? JSON.parse(authFromStorage) : null
      };
    } catch (e) {
      return { error: 'Failed to parse user data' };
    }
  };
  
  const userInfo = getCurrentUser();
  
  const getBadgeStyle = (condition) => ({
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: condition ? '#28a745' : '#dc3545',
    marginLeft: '8px'
  });
  
  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto'
  };
  
  const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9'
  };
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  };
  
  const cellStyle = {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left'
  };
  
  const headerStyle = {
    ...cellStyle,
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold'
  };
  
  return (
    <div style={containerStyle}>
      <h3 style={{ color: '#333', marginBottom: '20px' }}>🔍 Permission Debugger</h3>
      
      <div style={cardStyle}>
        <h4>User Information</h4>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={cellStyle}><strong>Permission Loading:</strong></td>
              <td style={cellStyle}>
                <span style={getBadgeStyle(!permissions.loading)}>
                  {permissions.loading ? 'Loading' : 'Loaded'}
                </span>
              </td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>User Role:</strong></td>
              <td style={cellStyle}>{userInfo.fromUser?.role || 'Unknown'}</td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>Is Super Admin:</strong></td>
              <td style={cellStyle}>
                <span style={getBadgeStyle(permissions.isSuperAdmin?.())}>
                  {permissions.isSuperAdmin?.() ? 'Yes' : 'No'}
                </span>
              </td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>Auth Email:</strong></td>
              <td style={cellStyle}>{userInfo.fromAuth?.user?.email || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={cardStyle}>
        <h4>DNA Sequencing Permissions</h4>
        <table style={tableStyle}>
          <tbody>
            <tr>
              <td style={cellStyle}><strong>canAccessDnaSequencingModule:</strong></td>
              <td style={cellStyle}>
                <span style={getBadgeStyle(permissions.canAccessDnaSequencingModule?.())}>
                  {permissions.canAccessDnaSequencingModule?.() ? 'Allowed' : 'Denied'}
                </span>
              </td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>DNA Sequencing Feature:</strong></td>
              <td style={cellStyle}>
                <span style={getBadgeStyle(permissions.hasDashboardFeature?.('dna_sequencing_module'))}>
                  {permissions.hasDashboardFeature?.('dna_sequencing_module') ? 'Enabled' : 'Disabled'}
                </span>
              </td>
            </tr>
            <tr>
              <td style={cellStyle}><strong>Function Available:</strong></td>
              <td style={cellStyle}>
                <span style={getBadgeStyle(typeof permissions.canAccessDnaSequencingModule === 'function')}>
                  {typeof permissions.canAccessDnaSequencingModule === 'function' ? 'Yes' : 'No'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={cardStyle}>
        <h4>Dashboard Features</h4>
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerStyle}>Feature</th>
                <th style={headerStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissions.dashboardFeatures || {}).map(([key, value]) => (
                <tr key={key}>
                  <td style={cellStyle}>{key}</td>
                  <td style={cellStyle}>
                    <span style={getBadgeStyle(value)}>
                      {value ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style={cardStyle}>
        <h4>All Available Permissions (Functions)</h4>
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerStyle}>Permission</th>
                <th style={headerStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissions).map(([key, value]) => {
                if (typeof value === 'function') {
                  try {
                    const result = value();
                    return (
                      <tr key={key}>
                        <td style={cellStyle}>{key}</td>
                        <td style={cellStyle}>
                          <span style={getBadgeStyle(result)}>
                            {result ? 'Allow' : 'Deny'}
                          </span>
                        </td>
                      </tr>
                    );
                  } catch (e) {
                    return (
                      <tr key={key}>
                        <td style={cellStyle}>{key}</td>
                        <td style={cellStyle}>
                          <span style={getBadgeStyle(false)}>Error</span>
                        </td>
                      </tr>
                    );
                  }
                }
                return null;
              }).filter(Boolean)}
            </tbody>
          </table>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
        <h5>Debug Information</h5>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>Permission Context Available:</strong> {permissions ? 'Yes' : 'No'}</p>
        <p><strong>User from localStorage:</strong> {userInfo.fromUser ? 'Found' : 'Not found'}</p>
        <p><strong>Auth from localStorage:</strong> {userInfo.fromAuth ? 'Found' : 'Not found'}</p>
      </div>
    </div>
  );
};

export default SimplePermissionDebugger;
