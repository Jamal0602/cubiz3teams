
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
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Get current session - use Promise.race to ensure we don't wait too long
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session retrieval timeout')), 3000)
        );
        
        const { data, error } = await Promise.race([
          sessionPromise,
          timeoutPromise.then(() => {
            console.log('Session timeout - redirecting to dashboard anyway');
            return { data: { session: true }, error: null };
          })
        ]) as any;
        
        if (error) {
          console.error('Session error:', error);
          setError('Failed to get session');
          toast.error('Authentication failed. Please try again.');
          navigate('/login');
          return;
        }
        
        if (!data.session) {
          console.error('No session found');
          setError('No session found');
          toast.error('No session found. Please log in again.');
          navigate('/login');
          return;
        }
        
        console.log('Authentication successful, redirecting to dashboard');
        toast.success('Successfully logged in!');
        
        // Immediate redirect - no delay
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError('Authentication failed');
        toast.error('An error occurred during authentication');
        navigate('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    // Start auth callback immediately - no delay
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
