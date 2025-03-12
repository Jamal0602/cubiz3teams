
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Define user profile type
export interface UserProfile {
  id: string;
  full_name: string;
  cubiz_id: string;
  role: 'admin' | 'manager' | 'employee';
  department?: string;
  location?: string;
  upi_id?: string;
  avatar_url?: string;
  verified: boolean;
  joined_at: string;
  bio?: string;
  skills?: string[];
  rank_points?: number;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  signup: (email: string, password: string, fullName: string, additionalData?: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateProfile: (userData: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    }
  };

  // Refresh profile data
  const refreshProfile = async () => {
    if (!user) return;
    const profile = await fetchProfile(user.id);
    if (profile) setProfile(profile);
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile data
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        if (profileData) {
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      const profile = await fetchProfile(data.user.id);
      
      if (profile && !profile.verified && profile.role !== 'admin') {
        // Redirect to verification pending page for non-admin unverified users
        navigate('/verification-pending');
        toast.info('Your account is pending verification');
      } else {
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (err: any) {
      const message = err?.message || 'An unknown error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      const message = err?.message || 'Failed to login with Google';
      toast.error(message);
      throw err;
    }
  };

  // Login with GitHub
  const loginWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      const message = err?.message || 'Failed to login with GitHub';
      toast.error(message);
      throw err;
    }
  };

  // Login with Apple
  const loginWithApple = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
    } catch (err: any) {
      const message = err?.message || 'Failed to login with Apple';
      toast.error(message);
      throw err;
    }
  };

  // Sign up function
  const signup = async (email: string, password: string, fullName: string, additionalData: any = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Add the additional data to the user metadata
      const userData = {
        full_name: fullName,
        bio: additionalData.bio || '',
        skills: additionalData.skills || [],
        department: additionalData.department || '',
        initial_rank_points: 20 // Initial rank points for signup
      };

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) throw error;
      
      // Redirect to verification pending page
      navigate('/verification-pending');
      toast.success('Signed up successfully! Your account is pending verification.');
    } catch (err: any) {
      const message = err?.message || 'An unknown error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      toast.info('Logged out successfully');
      navigate('/login');
    } catch (err: any) {
      const message = err?.message || 'Failed to logout';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData: Partial<UserProfile>) => {
    if (!user) throw new Error('No authenticated user');
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Refresh profile data
      await refreshProfile();
      
      toast.success('Profile updated successfully');
    } catch (err: any) {
      const message = err?.message || 'Failed to update profile';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        loading, 
        error, 
        login,
        loginWithGoogle,
        loginWithGithub,
        loginWithApple,
        signup, 
        logout, 
        isAuthenticated: !!user,
        updateProfile,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
