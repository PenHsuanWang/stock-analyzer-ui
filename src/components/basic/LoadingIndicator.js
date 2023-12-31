import React from 'react';
import { CircularProgress } from '@mui/material';

// This component renders a circular progress indicator centered on the page.
const LoadingIndicator = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </div>
  );
};

export default LoadingIndicator;
