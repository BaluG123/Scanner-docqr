import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import QRResultScreen from '../screens/QRResultScreen';
import 
QRGeneratorScreen from '../screens/QRGeneratorScreen';
import PDFScannerScreen from '../screens/PDFScannerScreen';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();

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
          title: 'Smart Scanner',
          drawerIcon: ({ color, size }) => (
            <Icon name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="QRScanner" 
        component={QRScannerScreen}
        options={{
          title: 'QR Scanner',
          drawerIcon: ({ color, size }) => (
            <Icon name="qr-code-scanner" size={size} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen 
        name="QRResult" 
        component={QRResultScreen}
        options={{
          title: 'Scan Result',
          drawerIcon: ({ color, size }) => (
            <Icon name="check-circle" size={size} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen 
        name="QRGenerator" 
        component={QRGeneratorScreen}
        options={{
          title: 'QR Generator',
          drawerIcon: ({ color, size }) => (
            <Icon name="qr-code" size={size} color={color} />
          ),
        }}
      />
      {/* <Drawer.Screen 
        name="PDFScanner" 
        component={PDFScannerScreen}
        options={{
          title: 'PDF Scanner',
          drawerIcon: ({ color, size }) => (
            <Icon name="picture-as-pdf" size={size} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
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