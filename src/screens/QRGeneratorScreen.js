import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Share, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QRGeneratorScreen = () => {
  const { colors } = useTheme();
  const [inputText, setInputText] = useState('');
  const [qrValue, setQrValue] = useState('');

  const generateQR = () => {
    if (!inputText.trim()) {
      Alert.alert('Error', 'Please enter some text or URL');
      return;
    }
    setQrValue(inputText.trim());
  };

  const handleShare = async () => {
    if (!qrValue) {
      Alert.alert('Error', 'Generate a QR code first');
      return;
    }

    try {
      await Share.share({
        message: qrValue,
        title: 'QR Code Content',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            placeholder="Enter text or URL"
            placeholderTextColor={colors.text + '80'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.generateButton, { backgroundColor: colors.primary }]}
            onPress={generateQR}
          >
            <Icon name="qr-code" size={24} color="#fff" />
            <Text style={styles.buttonText}>Generate QR Code</Text>
          </TouchableOpacity>
        </View>

        {qrValue ? (
          <View style={[styles.qrContainer, { backgroundColor: colors.card }]}>
            <LottieView
              source={require('../assets/animations/qr-generate.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
            <QRCode
              value={qrValue}
              size={wp('60%')}
              backgroundColor={colors.card}
              color={colors.text}
            />
            <TouchableOpacity
              style={[styles.shareButton, { backgroundColor: colors.primary }]}
              onPress={handleShare}
            >
              <Icon name="share" size={24} color="#fff" />
              <Text style={styles.buttonText}>Share QR Code</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <LottieView
              source={require('../assets/animations/qr-placeholder.json')}
              autoPlay
              loop
              style={styles.placeholderAnimation}
            />
            <Text style={[styles.placeholderText, { color: colors.text }]}>
              Enter text or URL to generate QR code
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('2%'),
    minHeight: hp('10%'),
    textAlignVertical: 'top',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('3%'),
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderRadius: 8,
    marginTop: hp('3%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
});

export default QRGeneratorScreen; 