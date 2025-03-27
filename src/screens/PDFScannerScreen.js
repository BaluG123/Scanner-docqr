import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const PDFScannerScreen = () => {
  const { colors } = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedImages, setScannedImages] = useState([]);
  const device = useCameraDevices('back');
  // const device = devices.back;
  const camera = React.useRef(null);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    setHasPermission(cameraPermission === 'granted');
  };

  const captureImage = useCallback(async () => {
    try {
      setIsScanning(true);
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
        enableShutterSound: false,
      });
      
      const newImage = {
        uri: `file://${photo.path}`,
        timestamp: new Date().getTime(),
      };
      
      setScannedImages(prev => [...prev, newImage]);
      setIsScanning(false);
    } catch (error) {
      console.error('Error capturing image:', error);
      setIsScanning(false);
      Alert.alert('Error', 'Failed to capture image');
    }
  }, []);

  const saveAsPDF = async () => {
    try {
      if (scannedImages.length === 0) {
        Alert.alert('No Images', 'Please scan some documents first');
        return;
      }

      // Create HTML content with images
      const htmlContent = `
        <html>
          <body>
            ${scannedImages.map(image => `
              <div style="page-break-after: always; margin-bottom: 20px;">
                <img src="${image.uri}" style="width: 100%; height: auto;" />
              </div>
            `).join('')}
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: 'scanned_document',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      
      if (file.filePath) {
        await Share.open({
          url: `file://${file.filePath}`,
          type: 'application/pdf',
        });
      } else {
        throw new Error('PDF creation failed');
      }
    } catch (error) {
      console.error('Error creating PDF:', error);
      Alert.alert('Error', 'Failed to create PDF');
    }
  };

  const shareImages = async () => {
    try {
      if (scannedImages.length === 0) {
        Alert.alert('No Images', 'Please scan some documents first');
        return;
      }

      await Share.open({
        urls: scannedImages.map(img => img.uri),
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('Error sharing images:', error);
      Alert.alert('Error', 'Failed to share images');
    }
  };

  const removeImage = (index) => {
    setScannedImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!hasPermission) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.text, { color: colors.text }]}>No camera permission</Text>
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
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      
      {scannedImages.length > 0 && (
        <View style={styles.previewContainer}>
          {scannedImages.map((image, index) => (
            <View key={image.timestamp} style={styles.previewItem}>
              <Image source={{ uri: image.uri }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={captureImage}
          disabled={isScanning}
        >
          <Icon name="camera-alt" size={24} color="#fff" />
        </TouchableOpacity>
        
        {scannedImages.length > 0 && (
          <>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={saveAsPDF}
            >
              <Icon name="picture-as-pdf" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={shareImages}
            >
              <Icon name="share" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewContainer: {
    position: 'absolute',
    top: hp('2%'),
    left: wp('2%'),
    right: wp('2%'),
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp('2%'),
  },
  previewItem: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  controls: {
    position: 'absolute',
    bottom: hp('5%'),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('5%'),
  },
  button: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
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
  text: {
    fontSize: wp('4%'),
    textAlign: 'center',
  },
});

export default PDFScannerScreen; 