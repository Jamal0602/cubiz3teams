
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

interface AppLayoutProps {
  children?: React.ReactNode;
  requiredRoles?: Array<'admin' | 'manager' | 'employee'>;
  verificationRequired?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  requiredRoles,
  verificationRequired = true
}) => {
  const { user, profile, isAuthenticated, loading, refreshProfile } = useAuth();
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [retries, setRetries] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are now offline. Some features may be limited.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Try to refresh the profile to ensure we have the latest data
    const initProfile = async () => {
      try {
        console.log('AppLayout: Initializing profile, authenticated:', isAuthenticated);
        if (isAuthenticated && !profile && retries < 3) {
          console.log(`AppLayout: Refreshing profile (attempt ${retries + 1})`);
          await refreshProfile();
          setRetries(prev => prev + 1);
        }
        setIsChecking(false);
      } catch (error) {
        console.error('AppLayout: Error refreshing profile:', error);
        setIsChecking(false);
      }
    };

    if (isChecking) {
      initProfile();
    }
  }, [isAuthenticated, profile, refreshProfile, retries, isChecking]);

  // Show loading state while auth is being checked or profile is being fetched
  if (loading || isChecking) {
    console.log('AppLayout: Loading state', { loading, isChecking });
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="lg" text="Loading your workspace..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('AppLayout: Not authenticated, redirecting to login');
    toast.error('You need to be logged in to access this page');
    return <Navigate to="/login" replace />;
  }

  // Check if user is verified (except for admins) when verification is required
  if (verificationRequired && profile && !profile.verified && profile.role !== 'admin') {
    console.log('AppLayout: User not verified, redirecting to verification pending');
    toast.error('Your account is pending verification');
    return <Navigate to="/verification-pending" replace />;
  }

  // Check for required roles
  if (requiredRoles && requiredRoles.length > 0 && profile) {
    // Check if user's role is in the allowed roles list or is an admin
    const hasRequiredRole = requiredRoles.includes(profile.role) || profile.role === 'admin';
    
    if (!hasRequiredRole) {
      console.log('AppLayout: User does not have required role');
      toast.error('You do not have permission to access this page');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If we're still waiting for profile but user is authenticated
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl p-8">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64 md:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNav />
        {!isOnline && (
          <div className="bg-yellow-100 dark:bg-yellow-900/40 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-200">
            You are currently offline. Some features may be limited.
          </div>
        )}
        <main className={cn(
          "flex-1 overflow-auto",
          "transition-all duration-300 ease-in-out"
        )}>
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
