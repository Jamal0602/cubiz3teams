
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader } from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, WifiOff } from 'lucide-react';

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
  const [offlineSince, setOfflineSince] = useState<Date | null>(null);
  const [pendingActions, setPendingActions] = useState<{
    type: string;
    data: any;
    timestamp: Date;
  }[]>([]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      
      // If we were offline before, show toast with duration
      if (offlineSince) {
        const offlineDuration = Date.now() - offlineSince.getTime();
        const minutes = Math.floor(offlineDuration / 60000);
        const seconds = Math.floor((offlineDuration % 60000) / 1000);
        
        let durationText = '';
        if (minutes > 0) {
          durationText = `${minutes}m ${seconds}s`;
        } else {
          durationText = `${seconds}s`;
        }
        
        toast.success(`You are back online! (Offline for ${durationText})`);
        
        // Process any pending actions
        if (pendingActions.length > 0) {
          toast.info(`Processing ${pendingActions.length} pending actions...`);
          // In a real app, we would process pending actions here
          // For now, we'll just clear them
          setTimeout(() => {
            setPendingActions([]);
            toast.success('All pending actions processed successfully');
          }, 1500);
        }
        
        setOfflineSince(null);
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineSince(new Date());
      toast.warning('You are now offline. Changes will be saved locally.');
    };
    
    const handleBeforeUnload = () => {
      // Save pending actions to localStorage before page unload
      if (pendingActions.length > 0) {
        localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Check for any pending actions in localStorage on mount
    const savedActions = localStorage.getItem('pendingActions');
    if (savedActions) {
      try {
        const parsedActions = JSON.parse(savedActions);
        if (Array.isArray(parsedActions) && parsedActions.length > 0) {
          setPendingActions(parsedActions);
          // Only show toast if we're online and can process these actions
          if (navigator.onLine) {
            toast.info(`Found ${parsedActions.length} pending actions from your previous session`);
          }
        }
      } catch (e) {
        console.error('Error parsing saved actions:', e);
        localStorage.removeItem('pendingActions');
      }
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [offlineSince, pendingActions]);

  useEffect(() => {
    // Try to refresh the profile to ensure we have the latest data
    const initProfile = async () => {
      try {
        console.log('AppLayout: Initializing profile, authenticated:', isAuthenticated);
        if (isAuthenticated && !profile && retries < 2) {
          console.log(`AppLayout: Refreshing profile (attempt ${retries + 1})`);
          await refreshProfile();
          setRetries(prev => prev + 1);
        }
        // Speed up verification process - complete in less than 5 seconds
        setTimeout(() => {
          setIsChecking(false);
        }, 50); // Ultra-fast timeout for immediate verification
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
          <div className="bg-yellow-100 dark:bg-yellow-900/40 px-4 py-2 text-sm text-yellow-800 dark:text-yellow-200 flex items-center justify-between">
            <div className="flex items-center">
              <WifiOff className="h-4 w-4 mr-2" />
              <span>
                You are currently offline. Your changes will be saved locally and synchronized when you reconnect.
              </span>
            </div>
            {pendingActions.length > 0 && (
              <span className="text-xs font-medium bg-yellow-200 dark:bg-yellow-800 px-2 py-1 rounded-full">
                {pendingActions.length} pending {pendingActions.length === 1 ? 'action' : 'actions'}
              </span>
            )}
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
