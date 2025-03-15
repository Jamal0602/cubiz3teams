
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const ProtectedRoute = ({ 
  children, 
  requiredRole
}: ProtectedRouteProps) => {
  const { profile } = useAuth();
  
  // Allow access to all users, regardless of authentication status
  return <>{children}</>;
};

export default ProtectedRoute;
