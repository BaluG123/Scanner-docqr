import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [qrSize, setQrSize] = useState(200);
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBackgroundColor, setQrBackgroundColor] = useState('#FFFFFF');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('qrSettings');
      if (settings) {
        const { qrSize, qrColor, qrBackgroundColor } = JSON.parse(settings);
        setQrSize(qrSize);
        setQrColor(qrColor);
        setQrBackgroundColor(qrBackgroundColor);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('qrSettings', JSON.stringify(newSettings));
      setQrSize(newSettings.qrSize);
      setQrColor(newSettings.qrColor);
      setQrBackgroundColor(newSettings.qrBackgroundColor);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        qrSize,
        qrColor,
        qrBackgroundColor,
        saveSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}; 