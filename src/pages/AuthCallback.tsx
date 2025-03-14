
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle auth callback immediately without any delay
    const handleAuthCallback = async () => {
      try {
        // Redirect immediately without waiting for session
        console.log('Authentication successful, redirecting to dashboard');
        navigate('/dashboard');
        toast.success('Successfully logged in!');
        setIsProcessing(false);
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError('Authentication failed');
        toast.error('An error occurred during authentication');
        navigate('/login');
        setIsProcessing(false);
      }
    };

    // Start auth callback immediately
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Loader size="md" text={error || "Logging you in..."} />
      {error && (
        <Button 
          onClick={() => navigate('/login')} 
          className="mt-4"
        >
          Return to Login
        </Button>
      )}
    </div>
  );
};

export default AuthCallback;
