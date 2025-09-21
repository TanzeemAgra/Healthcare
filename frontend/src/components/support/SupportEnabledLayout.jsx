import React from 'react';
import FloatingSupportButton from '../components/support/FloatingSupportButton';

const SupportEnabledLayout = ({ children }) => {
  return (
    <>
      {children}
      <FloatingSupportButton 
        position="bottom-right"
        showOnPages="all"
      />
    </>
  );
};

export default SupportEnabledLayout;
