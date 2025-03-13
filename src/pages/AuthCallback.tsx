
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsProcessing(true);
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setError('Failed to get session');
          toast.error('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        if (!data.session) {
          console.error('No session found');
          setError('No session found');
          toast.error('No session found. Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        console.log('Authentication successful, redirecting to dashboard');
        toast.success('Successfully logged in!');
        
        // Add a small delay to ensure the session is properly set
        setTimeout(() => {
          // Redirect to dashboard after successful authentication
          navigate('/dashboard');
        }, 1000);
      } catch (error) {
        console.error('Error during auth callback:', error);
        setError('Authentication failed');
        toast.error('An error occurred during authentication');
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <Loader size="md" text={error || "Logging you in..."} />
      {error && (
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Return to Login
        </button>
      )}
    </div>
  );
};

export default AuthCallback;
