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
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { qrSize, qrColor, qrBackgroundColor, saveSettings } = useSettings();
  const [localQrSize, setLocalQrSize] = useState(qrSize);
  const [localQrColor, setLocalQrColor] = useState(qrColor);
  const [localQrBackgroundColor, setLocalQrBackgroundColor] = useState(qrBackgroundColor);
  const { t, i18n } = useTranslation();

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
    Alert.alert(t('common.ok'), t('settings.savedMsg'));
  };

  const handleSliderChange = useCallback((value) => {
    const roundedValue = Math.round(value);
    setLocalQrSize(roundedValue);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Language Settings */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.language')}</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'en' && { backgroundColor: colors.primary }
              ]}
              onPress={() => changeLanguage('en')}
            >
              <Text style={[
                styles.languageText,
                { color: i18n.language === 'en' ? '#fff' : colors.text }
              ]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.languageOption,
                i18n.language === 'ja' && { backgroundColor: colors.primary }
              ]}
              onPress={() => changeLanguage('ja')}
            >
              <Text style={[
                styles.languageText,
                { color: i18n.language === 'ja' ? '#fff' : colors.text }
              ]}>日本語</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme Settings */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.theme')}</Text>
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.darkMode')}</Text>
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings.qrSettings')}</Text>
          
          {/* QR Size Setting */}
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.qrSize')}</Text>
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
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.qrColor')}</Text>
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
            <Text style={[styles.settingLabel, { color: colors.text }]}>{t('settings.backgroundColor')}</Text>
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

        {/* Check for Update Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.card, marginBottom: hp('2%'), marginTop: 0 }]}
          onPress={() => Alert.alert(t('settings.checkForUpdate'), t('settings.upToDate'))}
        >
          <Icon name="system-update" size={24} color={colors.text} />
          <Text style={[styles.saveButtonText, { color: colors.text }]}>{t('settings.checkForUpdate')}</Text>
        </TouchableOpacity>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSaveSettings}
        >
          <Icon name="save" size={24} color="#fff" />
          <Text style={styles.saveButtonText}>{t('settings.save')}</Text>
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
    height: 40,
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
  languageContainer: {
    flexDirection: 'row',
    gap: wp('4%'),
  },
  languageOption: {
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  languageText: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
  },
});

export default SettingsScreen;