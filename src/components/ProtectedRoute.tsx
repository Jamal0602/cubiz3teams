
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const ProtectedRoute = ({ 
  children
}: ProtectedRouteProps) => {
  // No auth check needed, all users are allowed access
  return <>{children}</>;
};

export default ProtectedRoute;
