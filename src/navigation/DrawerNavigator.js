import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import HomeScreen from '../screens/HomeScreen';
import UserListScreen from '../screens/UserListScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PDFScannerScreen from '../screens/PDFScannerScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import QRGeneratorScreen from '../screens/QRGeneratorScreen';
import QRResultScreen from '../screens/QRResultScreen';

const Drawer = createDrawerNavigator();

const CustomHeader = ({ title, colors, navigation }) => (
  <View style={[styles.headerContainer, { backgroundColor: colors.primary }]}>
    <TouchableOpacity 
      style={styles.menuButton}
      onPress={() => navigation.openDrawer()}
    >
      <Icon name="menu" size={24} color="#fff" />
    </TouchableOpacity>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

const DrawerNavigator = () => {
  const { colors } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#fff',
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.text,
          drawerStyle: {
            backgroundColor: colors.card,
            width: 280,
            borderRightColor: colors.border,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '500',
          },
          sceneContainerStyle: {
            backgroundColor: colors.background,
          },
          header: ({ route, navigation }) => (
            <CustomHeader 
              title={route.name === 'Home' ? 'Home' : 
                     route.name === 'UserList' ? 'User List' : 
                     route.name === 'PDFScanner' ? 'PDF Scanner' :
                     'Settings'} 
              colors={colors}
              navigation={navigation}
            />
          ),
          drawerType: 'front',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          swipeEnabled: true,
          swipeEdgeWidth: 50,
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="UserList"
          component={UserListScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="people" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="PDFScanner"
          component={PDFScannerScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="document-scanner" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ color }) => (
              <Icon name="settings" size={24} color={color} />
            ),
          }}
        />
      <Drawer.Screen
        name="QRScanner"
        component={QRScannerScreen}
        options={{
          title: 'QR Scanner',
          drawerIcon: ({ color }) => (
            <Icon name="qr-code-scanner" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="QRGenerator"
        component={QRGeneratorScreen}
        options={{
          title: 'QR Generator',
          drawerIcon: ({ color }) => (
            <Icon name="qr-code" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="QRResult"
        component={QRResultScreen}
        options={{
          title: 'QR Result',
          drawerItemStyle: { display: 'none' },
        }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
    zIndex: 1,
  },
  headerText: {
    color: '#fff',
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
});

export default DrawerNavigator; 