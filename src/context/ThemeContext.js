import React, { createContext, useState, useContext } from 'react';
import 'react-native-gesture-handler';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      background: '#0F172A',
      text: '#F8FAFC',
      card: '#1E293B',
      border: '#334155',
      primary: '#6366F1',
      secondary: '#34D399',
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
    } : {
      background: '#F8F9FA',
      text: '#1E293B',
      card: '#FFFFFF',
      border: '#E2E8F0',
      primary: '#4F46E5',
      secondary: '#10B981',
      success: '#16a34a',
      error: '#dc2626',
      warning: '#d97706',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 