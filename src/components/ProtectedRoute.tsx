
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (requiredRole && profile && profile.role !== requiredRole) {
        if (profile.role !== 'admin') { // Admins can access everything
          navigate('/dashboard');
        }
      }
    }
  }, [isAuthenticated, loading, navigate, profile, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && profile && profile.role !== requiredRole && profile.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
