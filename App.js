import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import './src/i18n';

const App = () => {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SettingsProvider>
    </ThemeProvider>
  );
};

export default App;