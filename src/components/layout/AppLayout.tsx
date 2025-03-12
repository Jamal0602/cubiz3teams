
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { CubeLoader } from '@/components/ui/cube-loader';

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

  useEffect(() => {
    // Try to refresh the profile to ensure we have the latest data
    const initProfile = async () => {
      if (isAuthenticated && !profile) {
        await refreshProfile();
      }
      setIsChecking(false);
    };

    initProfile();
  }, [isAuthenticated, profile, refreshProfile]);

  // Show loading state while auth is being checked or profile is being fetched
  if (loading || isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CubeLoader size="lg" text="Loading your workspace..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error('You need to be logged in to access this page');
    return <Navigate to="/login" replace />;
  }

  // Check if user is verified (except for admins) when verification is required
  if (verificationRequired && profile && !profile.verified && profile.role !== 'admin') {
    toast.error('Your account is pending verification');
    return <Navigate to="/verification-pending" replace />;
  }

  // Check for required roles
  if (requiredRoles && requiredRoles.length > 0 && profile) {
    // Check if user's role is in the allowed roles list or is an admin
    const hasRequiredRole = requiredRoles.includes(profile.role) || profile.role === 'admin';
    
    if (!hasRequiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopNav />
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
