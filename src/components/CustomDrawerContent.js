import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomDrawerContent = (props) => {
  const { colors } = useTheme();

  return (
    <DrawerContentScrollView
      {...props}
      style={[styles.container, { backgroundColor: colors.card }]}
    >
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Icon name="qr-code-scanner" size={wp('15%')} color="#fff" />
        </View>
        <Text style={[styles.headerText, { color: colors.text }]}>Smart Scanner</Text>
      </View>

      <View style={styles.drawerContent}>
        <DrawerItemList
          {...props}
          itemStyle={[styles.drawerItem, { backgroundColor: colors.background }]}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.text}
          activeBackgroundColor={colors.primary + '20'}
          inactiveBackgroundColor="transparent"
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, { backgroundColor: colors.background }]}
          onPress={() => props.navigation.closeDrawer()}
        >
          <Icon name="close" size={24} color={colors.text} />
          <Text style={[styles.footerText, { color: colors.text }]}>Close</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  avatarContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  headerText: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    paddingTop: hp('2%'),
    paddingHorizontal: wp('0%'),
  },
  drawerItem: {
    marginHorizontal: wp('2%'),
    marginVertical: hp('0.5%'),
    borderRadius: 10,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  drawerLabel: {
    fontSize: wp('3%'),
    marginLeft: -wp('4%'),
    fontWeight: '500',
  },
  footer: {
    padding: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('3%'),
    borderRadius: 10,
  },
  footerText: {
    fontSize: wp('4%'),
    marginLeft: wp('3%'),
    fontWeight: '500',
  },
});

export default CustomDrawerContent; 