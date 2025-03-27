import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';

const HomeScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const features = [
    {
      icon: 'qr-code-scanner',
      title: 'QR Code Scanner',
      description: 'Scan QR codes and barcodes instantly with your camera',
    },
    {
      icon: 'document-scanner',
      title: 'PDF Scanner',
      description: 'Convert physical documents into digital PDFs',
    },
    {
      icon: 'qr-code',
      title: 'QR Code Generator',
      description: 'Create custom QR codes for text, URLs, and more',
    },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <LottieView
          source={require('../assets/animations/qr-placeholder.json')}
          autoPlay
          loop
          style={styles.headerAnimation}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          Smart Scanner
        </Text>
        <Text style={[styles.subtitle, { color: colors.text + '80' }]}>
          Your all-in-one scanning solution
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <View 
            key={index}
            style={[styles.featureCard, { backgroundColor: colors.card }]}
          >
            <Icon name={feature.icon} size={wp('8%')} color={colors.primary} />
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              {feature.title}
            </Text>
            <Text style={[styles.featureDescription, { color: colors.text + '80' }]}>
              {feature.description}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.startButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('QRScanner')}
      >
        <Icon name="qr-code-scanner" size={wp('6%')} color="#fff" />
        <Text style={styles.startButtonText}>Start Scanning</Text>
      </TouchableOpacity>

      <View style={[styles.footer, { backgroundColor: colors.card }]}>
        <Text style={[styles.footerText, { color: colors.text + '80' }]}>
          Swipe from left to access more features
        </Text>
        <Icon name="chevron-left" size={wp('5%')} color={colors.text + '80'} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: hp('5%'),
    paddingBottom: hp('3%'),
  },
  headerAnimation: {
    width: wp('80%'),
    height: wp('60%'),
    marginBottom: hp('2%'),
  },
  title: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  subtitle: {
    fontSize: wp('4%'),
    textAlign: 'center',
  },
  featuresContainer: {
    padding: wp('5%'),
  },
  featureCard: {
    padding: wp('5%'),
    borderRadius: 12,
    marginBottom: hp('2%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featureTitle: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginTop: hp('1%'),
    marginBottom: hp('0.5%'),
  },
  featureDescription: {
    fontSize: wp('3.5%'),
    lineHeight: hp('2.5%'),
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: wp('5%'),
    padding: wp('4%'),
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
  startButtonText: {
    color: '#fff',
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
    marginTop: hp('2%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerText: {
    fontSize: wp('3.5%'),
    marginRight: wp('2%'),
  },
});

export default HomeScreen; 