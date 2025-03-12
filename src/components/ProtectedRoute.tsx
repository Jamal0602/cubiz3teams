
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CubeLoader } from '@/components/ui/cube-loader';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
  verificationRequired?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole,
  verificationRequired = true
}: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    // Try to refresh the profile first to ensure we have the latest data
    const initProfile = async () => {
      if (isAuthenticated && !profile) {
        await refreshProfile();
      }
      setIsChecking(false);
    };

    initProfile();
  }, [isAuthenticated, profile, refreshProfile]);

  useEffect(() => {
    // Check once the loading is complete and profile check is done
    if (!loading && !isChecking) {
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        toast.error('You need to be logged in to access this page');
        navigate('/login');
        return;
      }
      
      // Check if user is verified when required
      if (verificationRequired && profile && !profile.verified && profile.role !== 'admin') {
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

      // If we reach here, user is authorized
      setIsAuthorized(true);
    }
  }, [isAuthenticated, loading, navigate, profile, requiredRole, isChecking, verificationRequired]);

  // Show a loading state while checking auth and profile
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CubeLoader size="lg" text="Loading..." />
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
