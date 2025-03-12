
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the available theme modes
type ThemeMode = 'light' | 'dark' | 'neon';

// Define the theme context shape
interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Check localStorage for saved theme
    const savedTheme = localStorage.getItem('teamz_theme') as ThemeMode;
    return savedTheme || 'light';
  });

  // Effect to update document class and localStorage when theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('teamz_theme', theme);
    
    // Update document classes
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'neon');
    
    // Add the new theme class
    root.classList.add(theme);
  }, [theme]);

  // Function to set theme
  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
