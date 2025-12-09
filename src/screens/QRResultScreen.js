import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share, Linking, Alert, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LottieView from 'lottie-react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QRResultScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { data, type } = route.params;
  const { t } = useTranslation();

  useEffect(() => {
    saveToHistory();
  }, []);

  const saveToHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      let history = storedHistory ? JSON.parse(storedHistory) : [];
      
      const newItem = {
        data,
        type,
        date: new Date().toISOString(),
      };
      
      // Add to beginning, limit to 50 items
      history.unshift(newItem);
      if (history.length > 50) history.pop();
      
      await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: data,
        title: t('result.title'),
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
        Alert.alert(t('result.notUrlTitle'), t('result.notUrlMsg'));
      }
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={[styles.title, { color: colors.text }]}>{t('result.title')}</Text>
            <Text style={[styles.type, { color: colors.primary }]}>
              {t('result.type')}: {type || 'Unknown'}
            </Text>
            <Text style={[styles.data, { color: colors.text }]} numberOfLines={5}>
              {data}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleShare}
        >
          <Icon name="share" size={24} color="#fff" />
          <Text style={styles.buttonText}>{t('result.share')}</Text>
        </TouchableOpacity>

        {data.startsWith('http') && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleOpenLink}
          >
            <Icon name="open-in-new" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t('result.openLink')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
          <Text style={styles.buttonText}>{t('result.scanAgain')}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    alignItems: 'center',
    padding: wp('5%'),
  },
  animation: {
    width: wp('60%'),
    height: wp('60%'),
    marginTop: hp('2%'),
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
    marginBottom: hp('1%'),
  },
  type: {
    fontSize: wp('3.5%'),
    marginBottom: hp('2%'),
  },
  data: {
    fontSize: wp('4%'),
    lineHeight: hp('3%'),
  },
  buttonContainer: {
    padding: wp('4%'),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
    borderRadius: 8,
    marginVertical: hp('1%'),
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