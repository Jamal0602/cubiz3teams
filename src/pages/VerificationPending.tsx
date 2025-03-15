
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerificationPending = () => {
  const navigate = useNavigate();

  // Immediately redirect to dashboard
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
};

export default VerificationPending;
