
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const VerificationPending = () => {
  const { profile, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // If the user is verified or we can't confirm they're logged in at all, redirect them
  useEffect(() => {
    if (!loading) {
      if (profile?.verified) {
        navigate('/dashboard');
      } else if (!isAuthenticated) {
        navigate('/login');
      }
    }
  }, [profile, navigate, isAuthenticated, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-lg overflow-hidden">
        <div className="flex flex-col items-center p-8 text-center">
          <div className="relative mb-6">
            <Clock className="h-16 w-16 md:h-20 md:w-20 text-primary animate-pulse" />
            <div className="absolute bottom-0 right-0 bg-background rounded-full p-1">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
            </div>
          </div>
          
          <h1 className="text-xl md:text-2xl font-bold mb-2">Verification Pending</h1>
          <p className="text-muted-foreground mb-6">
            Your account is awaiting verification by an administrator. 
            You'll be able to access all features once your account is verified.
          </p>
          
          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center border rounded-lg p-3 bg-muted/50">
              <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
              <div className="text-sm text-left">
                <p className="font-medium">Account Created</p>
                <p className="text-muted-foreground">Your account has been successfully created</p>
              </div>
            </div>
            
            <div className="flex items-center border rounded-lg p-3 bg-muted/50">
              <Clock className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
              <div className="text-sm text-left">
                <p className="font-medium">Verification in Progress</p>
                <p className="text-muted-foreground">An administrator will review your account soon</p>
              </div>
            </div>
            
            <div className="flex items-center border rounded-lg p-3 bg-muted/50 opacity-50">
              <CheckCircle2 className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
              <div className="text-sm text-left">
                <p className="font-medium">Access Granted</p>
                <p className="text-muted-foreground">Once verified, you'll have full access to the platform</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
              Return to Home
            </Button>
            <Button variant="outline" className="w-full" onClick={() => logout()}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending;
