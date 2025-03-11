
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  const { user, profile, isAuthenticated, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-primary/30 mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error('You need to be logged in to access this page');
    return <Navigate to="/login" replace />;
  }

  // Check if user is verified (except for admins)
  if (verificationRequired && profile && !profile.verified && profile.role !== 'admin') {
    toast.error('Your account is pending verification');
    return <Navigate to="/verification-pending" replace />;
  }

  // Check for required roles
  if (requiredRoles && profile && !requiredRoles.includes(profile.role)) {
    // Admins can access everything
    if (profile.role !== 'admin') {
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
