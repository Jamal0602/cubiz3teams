
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'manager' | 'employee';
  requireVerification?: boolean;
}

const ProtectedRoute = ({ 
  children,
  requiredRole,
  requireVerification = true
}: ProtectedRouteProps) => {
  const { isAuthenticated, profile, loading } = useAuth();

  // If authentication is still loading, return null or a loading indicator
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If verification is required and user is not verified, redirect to verification pending page
  // Skip this check for admins who can access everything
  if (requireVerification && profile && !profile.verified && profile.role !== 'admin') {
    return <Navigate to="/verification-pending" />;
  }

  // If a specific role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && profile && profile.role !== requiredRole && profile.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // User passes all checks, render children
  return <>{children}</>;
};

export default ProtectedRoute;
