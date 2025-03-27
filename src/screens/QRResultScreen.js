import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Linking } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QRResultScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { data } = route.params;

  const handleShare = async () => {
    try {
      await Share.share({
        message: data,
        title: 'QR Code Content',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenLink = async () => {
    try {
      if (data.startsWith('http')) {
        await Linking.openURL(data);
      } else {
        Alert.alert('Not a URL', 'This QR code does not contain a URL');
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <LottieView
          source={require('../assets/animations/qr-success.json')}
          autoPlay
          loop={false}
          style={styles.animation}
          onAnimationFinish={() => {
            // Handle animation finish if needed
          }}
        />
        
        <View style={[styles.resultContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>QR Code Content</Text>
          <Text style={[styles.data, { color: colors.text }]} numberOfLines={5}>
            {data}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleShare}
          >
            <Icon name="share" size={24} color="#fff" />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>

          {data.startsWith('http') && (
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleOpenLink}
            >
              <Icon name="open-in-new" size={24} color="#fff" />
              <Text style={styles.buttonText}>Open Link</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    padding: wp('5%'),
  },
  animation: {
    width: wp('60%'),
    height: wp('60%'),
  },
  resultContainer: {
    width: '100%',
    padding: wp('5%'),
    borderRadius: 12,
    marginVertical: hp('2%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
  },
  data: {
    fontSize: wp('4%'),
    lineHeight: hp('3%'),
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
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
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    marginLeft: wp('2%'),
  },
});

export default QRResultScreen; 