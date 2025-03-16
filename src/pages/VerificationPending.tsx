
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@/components/ui/loader';

const VerificationPending = () => {
  const { profile, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  // If still loading, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // If user is verified or an admin, redirect to dashboard
  if (profile && (profile.verified || profile.role === 'admin')) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg text-center space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Verification Pending</h1>
          <p className="text-muted-foreground">
            Your account is pending verification by an administrator. 
            You'll be able to access all features once verified.
          </p>
        </div>

        <div className="bg-muted p-4 rounded-md text-left">
          <h3 className="font-medium mb-2">While you wait, you can:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Complete your profile information</li>
            <li>Browse public content in the community</li>
            <li>Review the available features</li>
          </ul>
        </div>

        <div className="flex flex-col space-y-2">
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile')}
            className="w-full"
          >
            Go to Your Profile
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/community')}
            className="w-full"
          >
            Browse Community
          </Button>
          <Button 
            variant="ghost" 
            onClick={logout}
            className="w-full text-muted-foreground"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
