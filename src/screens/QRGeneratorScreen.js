import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  PermissionsAndroid,
  Clipboard
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { Linking } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useSettings } from '../context/SettingsContext';

const QRGeneratorScreen = () => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const viewShotRef = useRef();
  const qrRef = useRef();
  const { qrSize, qrColor, qrBackgroundColor } = useSettings();

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        if (Platform.Version >= 33) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);
          return (
            granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
            granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
          );
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const saveAsPDF = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission denied', 'Cannot save PDF without storage permission');
        return;
      }
  
      if (qrRef.current) {
        qrRef.current.toDataURL(async (data) => {
          const htmlContent = `
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .container { max-width: 500px; margin: 0 auto; text-align: center; }
                  h1 { color: #2d3748; font-size: 24px; margin-bottom: 10px; }
                  .qr-image { margin: 20px 0; }
                  .qr-value { background: #f7fafc; padding: 10px; border-radius: 5px; word-wrap: break-word; }
                  .footer { margin-top: 30px; font-size: 12px; color: #718096; }
                </style>
              </head>
              <body>
                <div class="container">
                  <h1>${title || 'QR Code'}</h1>
                  <div class="qr-image">
                    <img src="data:image/png;base64,${data}" width="300" height="300" />
                  </div>
                  <div class="qr-value">${qrValue}</div>
                  <div class="footer">Generated on ${new Date().toLocaleDateString()}</div>
                </div>
              </body>
            </html>
          `;
  
          const fileName = `QR_${title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
          const destinationPath = Platform.OS === 'android'
            ? `${RNFS.DownloadDirectoryPath}/${fileName}.pdf`
            : `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;
  
          const options = {
            html: htmlContent,
            fileName: fileName,
            directory: Platform.OS === 'android' ? 'Downloads' : 'Documents',
          };
  
          const file = await RNHTMLtoPDF.convert(options);
  
          // Ensure file is moved correctly
          const finalPath = Platform.OS === 'android' ? destinationPath : file.filePath;
          if (Platform.OS === 'android') {
            await RNFS.moveFile(file.filePath, finalPath);
          }
  
          Alert.alert(
            'PDF Saved',
            'PDF has been generated successfully',
            [
              {
                text: 'View',
                onPress: async () => {
                  try {
                    const uri = Platform.OS === 'android' ? `file://${finalPath}` : finalPath;
                    const canOpen = await Linking.canOpenURL(uri);
                    if (canOpen) {
                      await Linking.openURL(uri);
                    } else {
                      Alert.alert(
                        'No PDF Viewer',
                        'Please install a PDF viewer app to view the file.\n\nFile saved at: ' + finalPath
                      );
                    }
                  } catch (error) {
                    Alert.alert(
                      'Error',
                      'Failed to open PDF. File saved at: ' + finalPath + '\nError: ' + error.message
                    );
                  }
                },
              },
              {
                text: 'Share',
                onPress: () => sharePDF(finalPath),
              },
              { text: 'OK' },
            ]
          );
        });
      }
    } catch (error) {
      console.error('PDF error:', error);
      Alert.alert('Error', 'Failed to save PDF: ' + error.message);
    }
  };
  
  const sharePDF = async (filePath) => {
    try {
      const uri = Platform.OS === 'android' ? `file://${filePath}` : filePath;
  
      // Verify file existence before sharing
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error('PDF file not found at: ' + filePath);
      }
  
      const shareOptions = {
        title: 'Share QR Code PDF',
        message: 'Check out this QR code PDF',
        url: uri,
        type: 'application/pdf',
      };
  
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Share PDF error:', error);
      Alert.alert('Error', 'Failed to share PDF: ' + error.message);
    }
  };

  const saveQRCode = async () => {
    try {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Storage permission is required to save QR codes');
        return;
      }

      if (qrRef.current) {
        qrRef.current.toDataURL(async (data) => {
          const fileName = `${title.replace(/\s+/g, '_')}_${Date.now()}.png`;
          const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
          
          await RNFS.writeFile(filePath, data, 'base64');
          const savedPath = await CameraRoll.save(`file://${filePath}`, { type: 'photo' });
          
          Alert.alert('Success', 'QR Code saved to gallery!');
        });
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      Alert.alert('Error', 'Failed to save QR code: ' + error.message);
    }
  };

  const generateQR = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setIsGenerating(true);
    // Simulate QR generation delay
    setTimeout(() => {
      setQrValue(content.trim());
      setIsGenerating(false);
    }, 1000);
  };

  const handleShare = async () => {
    if (!qrValue) {
      Alert.alert('Error', 'Generate a QR code first');
      return;
    }

    try {
      if (qrRef.current) {
        qrRef.current.toDataURL(async (data) => {
          const fileName = `qrcode-${Date.now()}.png`;
          const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
          
          await RNFS.writeFile(filePath, data, 'base64');
          
          const shareOptions = {
            title: 'Share QR Code',
            message: `Title: ${title}\nContent: ${qrValue}`,
            url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
            type: 'image/png',
            social: Share.Social.ALL,
            filename: fileName,
            saveToFiles: true,
            forceDialog: true,
            showAppsToView: true,
            includeBase64: true,
            base64: data,
          };
          
          await Share.open(shareOptions);
        });
      }
    } catch (error) {
      if (error.message !== 'User did not share') {
        console.error('Error sharing:', error);
        Alert.alert('Error', 'Failed to share QR code: ' + error.message);
      }
    }
  };

  const clearFields = () => {
    setTitle('');
    setContent('');
    setQrValue('');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
              <Text style={[styles.label, { color: colors.text }]}>Title</Text>
              <TextInput
                style={[styles.input, { 
                  color: colors.text, 
                  borderColor: colors.border,
                  backgroundColor: colors.background
                }]}
                placeholder="Enter title for your QR code"
                placeholderTextColor={colors.text + '80'}
                value={title}
                onChangeText={setTitle}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <Text style={[styles.label, { color: colors.text }]}>Content</Text>
              <TextInput
                style={[styles.input, styles.multilineInput, { 
                  color: colors.text, 
                  borderColor: colors.border,
                  backgroundColor: colors.background
                }]}
                placeholder="Enter content (text, URL, etc.)"
                placeholderTextColor={colors.text + '80'}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: colors.primary }]}
                  onPress={generateQR}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Icon name="qr-code" size={18} color="#fff" />
                      <Text style={styles.buttonText}>Generate QR Code</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.clearButton]}
                  onPress={clearFields}
                >
                  <Icon name="clear" size={18} color="#fff" />
                  <Text style={styles.buttonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            </View>

            {qrValue ? (
              <View style={[styles.qrContainer, { backgroundColor: colors.card }]}>
                <ViewShot ref={viewShotRef} style={styles.qrShotContainer}>
                  <Text style={[styles.qrTitle, { color: colors.text }]}>{title}</Text>
                  <QRCode
                    value={qrValue}
                    size={qrSize}
                    backgroundColor={qrBackgroundColor}
                    color={qrColor}
                    getRef={(ref) => (qrRef.current = ref)}
                  />
                </ViewShot>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={handleShare}
                  >
                    <Icon name="share" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.success }]}
                    onPress={saveQRCode}
                  >
                    <Icon name="save" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: '#f59e0b' }]}
    onPress={saveAsPDF}
  >
    <Icon name="picture-as-pdf" size={20} color="#fff" />
    <Text style={styles.buttonText}>PDF</Text>
  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.placeholderContainer}>
                <LottieView
                  source={require('../assets/animations/qr-generate.json')}
                  autoPlay
                  loop
                  style={styles.placeholderAnimation}
                />
                <Text style={[styles.placeholderText, { color: colors.text }]}>
                  Enter title and content to generate QR code
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: wp('5%'),
  },
  inputContainer: {
    padding: wp('5%'),
    borderRadius: 12,
    marginBottom: hp('3%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  label: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    fontSize: wp('4%'),
  },
  multilineInput: {
    height: hp('15%'),
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('2%'),
    width: wp('10'),
    gap: wp('2%'),
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: wp('45%'),
  },
  clearButton: {
    backgroundColor: '#ff4444',
    minWidth: wp('35%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('3.5%'),
    marginLeft: wp('1%'),
    fontWeight: '600',
  },
  qrContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  animation: {
    width: wp('40%'),
    height: wp('40%'),
    marginBottom: hp('2%'),
  },
  qrTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  qrShotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp('2%'),
    width: '100%',
    paddingHorizontal: wp('2%'),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: wp('30%'),
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderAnimation: {
    width: wp('60%'),
    height: wp('60%'),
  },
  placeholderText: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginTop: hp('2%'),
  },
});

export default QRGeneratorScreen; 