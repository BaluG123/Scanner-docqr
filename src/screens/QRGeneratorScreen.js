import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Share, 
  Alert, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import QRCode from 'react-native-qrcode-svg';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QRGeneratorScreen = () => {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrSize, setQrSize] = useState(200);

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
      await Share.share({
        message: `Title: ${title}\nContent: ${qrValue}`,
        title: 'QR Code Content',
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
                <Text style={[styles.qrTitle, { color: colors.text }]}>{title}</Text>
                <QRCode
                  value={qrValue}
                  size={qrSize}
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
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
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