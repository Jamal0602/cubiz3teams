
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'employee';

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  cubizId: string;
  avatarUrl?: string;
  department?: string;
  location?: string;
  upiId?: string;
  joinedAt: string;
}

// Define auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Mock user data for development
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    cubizId: 'admin@cubiz',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    department: 'Management',
    location: 'New York',
    upiId: 'admin@upi',
    joinedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@example.com',
    name: 'Manager User',
    role: 'manager',
    cubizId: 'manager@cubiz',
    avatarUrl: 'https://i.pravatar.cc/150?img=48',
    department: 'Sales',
    location: 'Boston',
    joinedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'employee@example.com',
    name: 'Employee User',
    role: 'employee',
    cubizId: 'employee@cubiz',
    avatarUrl: 'https://i.pravatar.cc/150?img=30',
    department: 'Development',
    location: 'San Francisco',
    joinedAt: new Date().toISOString(),
  },
];

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if user is stored in local storage
        const storedUser = localStorage.getItem('cubiz_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Session check error:', err);
        setError('Failed to restore session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find user with matching email (case insensitive)
      const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      // If user not found or password is not 'password' (for testing), throw error
      if (!foundUser || password !== 'password') {
        throw new Error('Invalid email or password');
      }

      // Set user in state and localStorage
      setUser(foundUser);
      localStorage.setItem('cubiz_user', JSON.stringify(foundUser));
      
      // Show success toast
      toast.success('Logged in successfully');
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('cubiz_user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  // Update profile function
  const updateProfile = async (userData: Partial<User>) => {
    if (!user) throw new Error('No authenticated user');
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user with new data
      const updatedUser = { ...user, ...userData };
      
      // Update state and localStorage
      setUser(updatedUser);
      localStorage.setItem('cubiz_user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
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
        loading, 
        error, 
        login, 
        logout, 
        isAuthenticated: !!user,
        updateProfile
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
