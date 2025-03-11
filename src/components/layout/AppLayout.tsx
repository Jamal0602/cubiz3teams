
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import TopNav from './TopNav';
import SidebarNav from './SidebarNav';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children?: React.ReactNode;
  requiredRoles?: Array<'admin' | 'manager' | 'employee'>;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, requiredRoles }) => {
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
    return <Navigate to="/login" replace />;
  }

  // Check for required roles
  if (requiredRoles && profile && !requiredRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
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
