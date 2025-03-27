import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, { useSharedValue, useAnimatedProps } from 'react-native-reanimated';

// Create animated camera component for zoom
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

const QRScannerScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const device = useCameraDevice('back');
  const isFocused = useIsFocused();

  // Zoom functionality
  const zoom = useSharedValue(0);
  const minZoom = 0;
  const maxZoom = 1;

  const cameraAnimatedProps = useAnimatedProps(() => {
    'worklet';
    return {
      zoom: zoom.value,
    };
  });

  // Request camera permissions
  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Reset scanning when screen comes into focus
  useEffect(() => {
    if (isFocused) {
      setIsScanning(true);
    }
  }, [isFocused]);

  // Setup code scanner
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'code-128', 'code-39', 'code-93', 'codabar', 'ean-8', 'itf', 'upc-e'],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && isScanning) {
        setIsScanning(false);
        const code = codes[0];
        navigation.navigate('QRResult', {
          data: code.value,
          type: code.type,
          rawValue: code.value
        });
      }
    }
  });

  // Setup pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      'worklet';
      // Adjust zoom based on scale, keeping it between minZoom and maxZoom
      const newZoom = Math.min(Math.max(zoom.value * event.scale, minZoom), maxZoom);
      zoom.value = newZoom;
    });

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Camera permission is required</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GestureDetector gesture={pinchGesture}>
        <ReanimatedCamera
          style={styles.camera}
          device={device}
          isActive={isFocused && isScanning}
          animatedProps={cameraAnimatedProps}
          enableZoomGesture={false}
          codeScanner={codeScanner}
        />
      </GestureDetector>
      
      <View style={styles.scanOverlay}>
        <View style={styles.scanFrame} />
      </View>
      
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        <Text style={[styles.scanText, { color: colors.text }]}>
          Point camera at QR or barcode
        </Text>
        <View style={styles.zoomInfo}>
          <Text style={[styles.zoomText, { color: colors.text }]}>
            Pinch to zoom ({Math.round(zoom.value * 100)}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: wp('4%'),
    textAlign: 'center',
    padding: wp('5%'),
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: wp('5%'),
  },
  scanText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  zoomInfo: {
    alignItems: 'center',
  },
  zoomText: {
    fontSize: wp('3.5%'),
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: wp('70%'),
    height: wp('70%'),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});

export default QRScannerScreen; 