
import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Don't show navbar on the auth page
  const hideNavbar = location.pathname === '/login' || 
                     location.pathname === '/auth/callback';

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      {!hideNavbar && (
        <nav className="border-b bg-background/80 backdrop-blur-sm z-10">
          <div className="container mx-auto flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl">
                C
              </div>
              <Link to="/" className="font-bold text-xl md:text-2xl">Cubiz Teams</Link>
            </div>
            
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Button asChild size="sm">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <Button asChild size="sm">
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </nav>
      )}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
