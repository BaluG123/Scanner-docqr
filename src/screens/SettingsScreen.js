import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.settingItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.settingLeft}>
          <Icon 
            name={isDarkMode ? "dark-mode" : "light-mode"} 
            size={24} 
            color={colors.text} 
          />
          <Text style={[styles.settingText, { color: colors.text }]}>
            Dark Mode
          </Text>
        </View>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: colors.primary }}
          thumbColor={isDarkMode ? colors.secondary : '#f4f3f4'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp('4%'),
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: hp('2%'),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: wp('4%'),
    marginLeft: wp('3%'),
  },
});

export default SettingsScreen; 