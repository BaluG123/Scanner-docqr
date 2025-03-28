import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';

const QRGeneratorScreen = () => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logo, setLogo] = useState(null);
  const viewShotRef = useRef();
  const qrRef = useRef();
  const { qrSize, qrColor, qrBackgroundColor } = useSettings();

  const handleGenerateQR = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    setIsGenerating(true);
    const qrData = {
      title: title.trim(),
      content: content.trim(),
    };
    setQrValue(JSON.stringify(qrData));
    setIsGenerating(false);
  };

  const handlePickLogo = () => {
    ImagePicker.launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      maxWidth: 200,
      maxHeight: 200,
    }, (response) => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode) {
        Alert.alert('Error', 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets[0]) {
        setLogo(response.assets[0].uri);
      }
    });
  };

  const handleRemoveLogo = () => {
    setLogo(null);
  };

  const handleShareQR = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert('Error', 'QR code not ready');
        return;
      }

      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        type: 'image/png',
      });
    } catch (error) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share QR code');
      }
    }
  };

  const handleSaveQR = async () => {
    try {
      if (!viewShotRef.current) {
        Alert.alert('Error', 'QR code not ready');
        return;
      }

      const uri = await viewShotRef.current.capture();
      const fileName = `QR_${Date.now()}.png`;
      const filePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.moveFile(uri, filePath);
      await RNFS.saveFile(filePath, filePath);
      Alert.alert('Success', 'QR code saved to gallery');
    } catch (error) {
      Alert.alert('Error', 'Failed to save QR code');
    }
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
            {/* Input Container */}
            <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter title"
                placeholderTextColor={colors.text + '80'}
                value={title}
                onChangeText={setTitle}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter content"
                placeholderTextColor={colors.text + '80'}
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
              />
              <TouchableOpacity
                style={[styles.generateButton, { backgroundColor: colors.primary }]}
                onPress={handleGenerateQR}
                disabled={isGenerating}
              >
                <Icon name="qr-code" size={24} color="#fff" />
                <Text style={styles.buttonText}>Generate QR Code</Text>
              </TouchableOpacity>
            </View>

            {qrValue ? (
              <View style={[styles.qrContainer, { backgroundColor: colors.card }]}>
                <ViewShot ref={viewShotRef} style={styles.qrShotContainer}>
                  <Text style={[styles.qrTitle, { color: colors.text }]}>{title}</Text>
                  <View style={styles.qrWrapper}>
                    <QRCode
                      value={qrValue}
                      size={qrSize}
                      backgroundColor={qrBackgroundColor}
                      color={qrColor}
                      getRef={(ref) => (qrRef.current = ref)}
                    />
                    {logo && (
                      <View style={styles.logoContainer}>
                        <Image
                          source={{ uri: logo }}
                          style={styles.logo}
                        />
                      </View>
                    )}
                  </View>
                </ViewShot>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={handleShareQR}
                  >
                    <Icon name="share" size={24} color="green" />
                    <Text style={styles.buttonText}>Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.success }]}
                    onPress={handleSaveQR}
                  >
                    <Icon name="save" size={24} color="green" />
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: logo ? colors.warning : colors.primary }]}
                    onPress={logo ? handleRemoveLogo : handlePickLogo}
                  >
                    <Icon name={logo ? "remove-circle" : "add-photo-alternate"} size={24} color="red" />
                    <Text style={styles.buttonText}>{logo ? 'Remove Logo' : 'Add Logo'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={[styles.placeholderContainer, { backgroundColor: colors.card }]}>
                <Icon name="qr-code" size={wp('20%')} color={colors.text + '40'} />
                <Text style={[styles.placeholderText, { color: colors.text + '80' }]}>
                  Generate a QR code to see it here
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
    borderRadius: 10,
    marginBottom: hp('3%'),
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    fontSize: wp('4%'),
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
    borderRadius: 25,
  },
  qrContainer: {
    padding: wp('5%'),
    borderRadius: 10,
    alignItems: 'center',
  },
  qrShotContainer: {
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  qrWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: wp('5%'),
    padding: wp('2%'),
  },
  logo: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: hp('3%'),
    flexWrap: 'wrap',
    gap: wp('3%'),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderRadius: 25,
    minWidth: wp('25%'),
  },
  buttonText: {
    color: 'green',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('5%'),
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: wp('4%'),
    marginTop: hp('2%'),
    textAlign: 'center',
  },
});

export default QRGeneratorScreen; 