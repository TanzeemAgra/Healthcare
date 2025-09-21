import React from 'react';

const IconTest = () => {
  const testIcons = [
    'ri-dashboard-fill',
    'ri-microscope-fill',
    'ri-test-tube-fill',
    'ri-git-branch-fill',
    'ri-shield-check-fill',
    'ri-brain-fill',
    'ri-file-chart-fill',
    'ri-dna-line',
    'ri-dna-fill'
  ];

  const containerStyle = {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa'
  };

  const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const iconRowStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderBottom: '1px solid #eee',
    gap: '15px'
  };

  const iconStyle = {
    fontSize: '24px',
    color: '#007bff',
    width: '30px',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '20px' }}>🔍 DNA Sequencing Sidebar Icons Test</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h4>Current Sidebar Icons:</h4>
          {testIcons.map((iconClass, index) => (
            <div key={index} style={iconRowStyle}>
              <i className={iconClass} style={iconStyle}></i>
              <span><strong>{iconClass}</strong></span>
              <span style={{ color: '#666', fontSize: '14px' }}>
                {iconClass === 'ri-git-branch-fill' && '← Variant Calling Icon'}
                {iconClass === 'ri-brain-fill' && '← AI Genomics Lab Icon'}
                {iconClass === 'ri-dashboard-fill' && '← Dashboard Icon'}
                {iconClass === 'ri-test-tube-fill' && '← Sample Management Icon'}
                {iconClass === 'ri-microscope-fill' && '← Genome Analysis Icon'}
                {iconClass === 'ri-shield-check-fill' && '← Quality Control Icon'}
                {iconClass === 'ri-file-chart-fill' && '← Reports Icon'}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e7f3ff', borderLeft: '4px solid #007bff' }}>
          <h5>Icon Status Check:</h5>
          <p>✅ All icons should be visible above</p>
          <p>✅ Variant Calling now uses "git-branch-fill" icon for better visual representation</p>
          <p>✅ AI Genomics Lab added to sidebar with "brain-fill" icon</p>
          <p>📝 If any icon appears as a square or missing, it means the RemixIcon CSS is not loaded properly</p>
        </div>

        <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          <strong>Navigation:</strong> Use the sidebar to test actual navigation and icon display
        </div>
      </div>
    </div>
  );
};

export default IconTest;
