
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const VerificationPending = () => {
  // Simply render a redirect component - no need for useEffect
  return <Navigate to="/dashboard" replace />;
};

export default VerificationPending;
