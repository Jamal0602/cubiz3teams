
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader } from '@/components/ui/loader';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          throw error;
        }
        
        if (!data.session) {
          console.error('No session found');
          navigate('/login');
          return;
        }
        
        console.log('Authentication successful, redirecting to dashboard');
        // Redirect to dashboard after successful authentication
        navigate('/dashboard');
      } catch (error) {
        console.error('Error during auth callback:', error);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="md" text="Logging you in..." />
    </div>
  );
};

export default AuthCallback;
