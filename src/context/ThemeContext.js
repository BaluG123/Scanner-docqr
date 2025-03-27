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
      background: '#1A1A1A',
      text: '#FFFFFF',
      card: '#2D2D2D',
      border: '#404040',
      primary: '#2196F3',
      secondary: '#64B5F6',
    } : {
      background: '#F5F5F5',
      text: '#333333',
      card: '#FFFFFF',
      border: '#E0E0E0',
      primary: '#2196F3',
      secondary: '#64B5F6',
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