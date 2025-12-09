import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import QRGeneratorScreen from '../screens/QRGeneratorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const screenOptions = {
    headerStyle: {
      backgroundColor: colors.background,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: wp('4.5%'),
    },
    drawerStyle: {
      backgroundColor: colors.card,
      width: wp('80%'),
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    drawerLabelStyle: {
      color: colors.text,
      fontSize: wp('4%'),
      marginLeft: -wp('1%'),
      fontWeight: '500',
    },
    drawerItemStyle: {
      paddingVertical: wp('2%'),
      marginHorizontal: wp('2%'),
      borderRadius: 10,
    },
    drawerActiveTintColor: colors.primary,
    drawerInactiveTintColor: colors.text,
    drawerActiveBackgroundColor: colors.primary + '20',
    drawerInactiveBackgroundColor: 'transparent',
    drawerIconStyle: {
      marginRight: wp('2%'),
    },
    drawerType: 'front',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    swipeEnabled: true,
    swipeEdgeWidth: 50,
    headerRight: () => (
      <TouchableOpacity
        onPress={toggleTheme}
        style={[styles.themeButton, { backgroundColor: colors.card }]}
      >
        <Icon
          name={isDarkMode ? 'light-mode' : 'dark-mode'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    ),
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={screenOptions}
      initialRouteName="Home"
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: t('home.title'),
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{
          title: t('home.scannerFeature'),
          drawerIcon: ({ color, size }) => (
            <Icon name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="QRGenerator" 
        component={QRGeneratorScreen}
        options={{
          title: t('home.generatorFeature'),
          drawerIcon: ({ color, size }) => (
            <Icon name="qr-code" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          title: t('history.title'),
          drawerIcon: ({ color, size }) => (
            <Icon name="history" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: t('settings.title'),
          drawerIcon: ({ color, size }) => (
            <Icon name="settings" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  themeButton: {
    marginRight: wp('4%'),
    padding: wp('2%'),
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default DrawerNavigator;