
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationPending = () => {
  const navigate = useNavigate();

  // Immediately redirect to dashboard
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

export default VerificationPending;
