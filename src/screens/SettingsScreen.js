import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SettingsScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { qrSize, qrColor, qrBackgroundColor, saveSettings } = useSettings();
  const [localQrSize, setLocalQrSize] = useState(qrSize);
  const [localQrColor, setLocalQrColor] = useState(qrColor);
  const [localQrBackgroundColor, setLocalQrBackgroundColor] = useState(qrBackgroundColor);

  useEffect(() => {
    setLocalQrSize(qrSize);
    setLocalQrColor(qrColor);
    setLocalQrBackgroundColor(qrBackgroundColor);
  }, [qrSize, qrColor, qrBackgroundColor]);

  const predefinedColors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
  ];

  const handleSaveSettings = () => {
    saveSettings({
      qrSize: localQrSize,
      qrColor: localQrColor,
      qrBackgroundColor: localQrBackgroundColor,
    });
    Alert.alert('Settings saved successfully');
  };

  const handleSliderChange = useCallback((value) => {
    // Round the value to prevent floating point issues
    const roundedValue = Math.round(value);
    setLocalQrSize(roundedValue);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Theme Settings */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Theme</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* QR Code Settings */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>QR Code Settings</Text>
          
          {/* QR Size Setting */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>QR Code Size</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={300}
                value={localQrSize}
                onValueChange={handleSliderChange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor="#767577"
                thumbTintColor={colors.primary}
                step={1}
              />
              <Text style={[styles.sliderValue, { color: colors.text }]}>{localQrSize}px</Text>
            </View>
          </View>

          {/* QR Color Setting */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>QR Code Color</Text>
            <View style={styles.colorGrid}>
              {predefinedColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    localQrColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setLocalQrColor(color)}
                />
              ))}
            </View>
          </View>

          {/* QR Background Color Setting */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>Background Color</Text>
            <View style={styles.colorGrid}>
              {predefinedColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    localQrBackgroundColor === color && styles.selectedColor,
                  ]}
                  onPress={() => setLocalQrBackgroundColor(color)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveSettings}
        >
          <Icon name="save" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerTitle: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: wp('5%'),
  },
  section: {
    padding: wp('5%'),
    borderRadius: 10,
    marginBottom: hp('3%'),
  },
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    marginBottom: hp('2%'),
  },
  settingItem: {
    marginBottom: hp('2%'),
  },
  settingLabel: {
    fontSize: wp('4%'),
    marginBottom: hp('1%'),
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
    paddingHorizontal: wp('2%'),
  },
  slider: {
    flex: 1,
    height: 40, // Add fixed height to prevent layout shifts
  },
  sliderValue: {
    fontSize: wp('4%'),
    minWidth: wp('15%'),
    textAlign: 'right',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  colorOption: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
    borderRadius: 25,
    marginTop: hp('2%'),
    marginBottom: hp('5%'),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontWeight: '600',
    marginLeft: wp('2%'),
  },
});

export default SettingsScreen; 