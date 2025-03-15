
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  // Allow all users to access public routes without any checks
  return <Outlet />;
};

export default PublicLayout;
