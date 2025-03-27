import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Alert, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';

const QRScannerScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [isScanning, setIsScanning] = useState(true);

  const onSuccess = (e) => {
    setIsScanning(false);
    navigation.navigate('QRResult', { data: e.data });
  };

  const onError = () => {
    Alert.alert('Error', 'Failed to scan QR code');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <QRCodeScanner
        onRead={onSuccess}
        showMarker={true}
        reactivate={true}
        reactivateTimeout={3000}
        reactivateWhenInactive={true}
        topContent={
          <Text style={[styles.instructions, { color: colors.text }]}>
            Position the QR code within the frame
          </Text>
        }
        containerStyle={styles.scannerContainer}
        cameraStyle={styles.camera}
        markerStyle={styles.marker}
        topViewStyle={styles.topView}
        bottomViewStyle={styles.bottomView}
      />
      <View style={styles.animationContainer}>
        <LottieView
          source={require('../assets/animations/qr-generate.json')}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scannerContainer: {
    flex: 1,
  },
  camera: {
    height: Dimensions.get('window').height,
  },
  marker: {
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
  },
  topView: {
    flex: 0,
    alignItems: 'center',
    paddingTop: hp('5%'),
  },
  bottomView: {
    flex: 0,
  },
  instructions: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  animationContainer: {
    position: 'absolute',
    top: hp('20%'),
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  animation: {
    width: wp('60%'),
    height: wp('60%'),
  },
});

export default QRScannerScreen; 