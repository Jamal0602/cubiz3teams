
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check once the loading is complete
    if (!loading) {
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        toast.error('You need to be logged in to access this page');
        navigate('/login');
        return;
      }
      
      // Check if user is verified
      if (profile && !profile.verified && profile.role !== 'admin') {
        toast.error('Your account is pending verification');
        navigate('/verification-pending');
        return;
      }
      
      // Check for required role
      if (requiredRole && profile && profile.role !== requiredRole) {
        if (profile.role !== 'admin') { // Admins can access everything
          toast.error(`Only ${requiredRole}s can access this page`);
          navigate('/dashboard');
          return;
        }
      }
    }
  }, [isAuthenticated, loading, navigate, profile, requiredRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/30 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (profile && !profile.verified && profile.role !== 'admin') {
    return null;
  }

  if (requiredRole && profile && profile.role !== requiredRole && profile.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
