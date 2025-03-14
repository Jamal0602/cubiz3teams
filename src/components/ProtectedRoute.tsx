
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    // Try to refresh the profile first to ensure we have the latest data
    const initProfile = async () => {
      try {
        if (isAuthenticated && !profile && retries < 1) { // Reduced max retries to 1
          console.log(`ProtectedRoute: Refreshing profile (attempt ${retries + 1})`);
          await refreshProfile();
          setRetries(prev => prev + 1);
        }
        // Speed up the verification process significantly
        setTimeout(() => {
          setIsChecking(false);
        }, 100); // Extremely reduced timeout
      } catch (error) {
        console.error('Error initializing profile:', error);
        setIsChecking(false);
      }
    };

    if (isChecking) {
      initProfile();
    }
  }, [isAuthenticated, profile, refreshProfile, isChecking, retries]);

  useEffect(() => {
    // Check once the loading is complete and profile check is done
    if (!loading && !isChecking) {
      // Not authenticated, redirect to login
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      // Check if user is verified when required
      if (verificationRequired && profile && !profile.verified && profile.role !== 'admin') {
        navigate('/verification-pending');
        return;
      }
      
      // Check for required role
      if (requiredRole && profile && profile.role !== requiredRole) {
        if (profile.role !== 'admin') { // Admins can access everything
          navigate('/dashboard');
          return;
        }
      }

      // If we reach here, user is authorized
      setIsAuthorized(true);
    }
  }, [isAuthenticated, loading, navigate, profile, requiredRole, isChecking, verificationRequired]);

  // Show a loading state while checking auth and profile, but not for more than 2 seconds
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="md" text="Verifying access..." />
      </div>
    );
  }

  // If we're still waiting for profile but user is authenticated
  if (isAuthenticated && !profile && !isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <>{children}</> : null;
};

export default ProtectedRoute;
