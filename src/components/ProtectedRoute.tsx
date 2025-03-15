
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const ProtectedRoute = ({ 
  children
}: ProtectedRouteProps) => {
  // All users allowed access with no restrictions
  return <>{children}</>;
};

export default ProtectedRoute;
