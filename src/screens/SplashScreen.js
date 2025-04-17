// import React, { useEffect } from 'react';
// import { View, StyleSheet, Image } from 'react-native';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigation.replace('DrawerNavigator');
//     }, 2000);

//     return () => clearTimeout(timer);
//   }, [navigation]);

//   return (
//     <View style={styles.container}>   
//       <Image
//         source={require('../assets/images/logo.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />
//     </View>           
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//   },
//   logo: {
//     width: wp('50%'),
//     height: hp('20%'),
//   },
// });

// export default SplashScreen; 

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, ActivityIndicator, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SplashScreen = ({ navigation }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [iconAnim] = useState(new Animated.Value(0));
  const [loadingText, setLoadingText] = useState('Loading');

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Icon animation (slightly delayed)
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(iconAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Loading text animation (dots)
    const interval = setInterval(() => {
      setLoadingText(prev => {
        if (prev === 'Loading...') return 'Loading';
        return prev + '.';
      });
    }, 500);

    // Navigate to main screen after timeout
    const timer = setTimeout(() => {
      navigation.replace('DrawerNavigator');
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigation, fadeAnim, iconAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.welcomeTitle}>QRLink</Text>
        <Text style={styles.welcomeSubtitle}>Scan & Generate QR Codes Instantly</Text>
        
        <Animated.View style={[styles.featuresContainer, { opacity: iconAnim }]}>
          <View style={styles.featureItem}>
            <MaterialIcons name="qr-code-scanner" size={wp('8%')} color="#007AFF" />
            <Text style={styles.featureText}>Scan</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="qr-code" size={wp('8%')} color="#007AFF" />
            <Text style={styles.featureText}>Generate</Text>
          </View>
          
          <View style={styles.featureItem}>
            <MaterialIcons name="history" size={wp('8%')} color="#007AFF" />
            <Text style={styles.featureText}>History</Text>
          </View>
        </Animated.View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#007AFF" style={styles.loadingIndicator} />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: wp('50%'),
    height: hp('20%'),
    marginBottom: hp('2%'),
  },
  welcomeTitle: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: hp('1%'),
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: wp('4%'),
    color: '#666666',
    marginBottom: hp('3%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: wp('90%'),
    marginBottom: hp('4%'),
  },
  featureItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: wp('3%'),
    width: wp('25%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    marginTop: hp('1%'),
    fontSize: wp('3.5%'),
    color: '#555555',
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  loadingIndicator: {
    marginRight: wp('2%'),
  },
  loadingText: {
    fontSize: wp('3.5%'),
    color: '#007AFF',
  },
  versionText: {
    position: 'absolute',
    bottom: -hp('15%'),
    fontSize: wp('3%'),
    color: '#999999',
  },
});

export default SplashScreen;