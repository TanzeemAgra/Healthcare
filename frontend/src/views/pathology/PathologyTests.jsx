import React from 'react';

const PathologyTests = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Pathology Tests</h1>
      <p>This is the Pathology Tests page. Route is working correctly!</p>
      <div style={{ 
        backgroundColor: '#d4edda', 
        border: '1px solid #c3e6cb', 
        color: '#155724', 
        padding: '15px', 
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        ✅ Route: /pathology/tests is successfully configured and accessible
      </div>
    </div>
  );
};

export default PathologyTests;