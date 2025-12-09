import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const HistoryScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [history, setHistory] = useState([]);
  const { t } = useTranslation();

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem('scanHistory');
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('scanHistory');
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const deleteItem = async (index) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    try {
      await AsyncStorage.setItem('scanHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.card }]}>
      <TouchableOpacity 
        style={styles.itemContent}
        onPress={() => navigation.navigate('QRResult', { data: item.data, type: item.type })}
      >
        <View style={styles.iconContainer}>
            <Icon name={item.type === 'QR_CODE' ? 'qr-code' : 'qr-code-scanner'} size={24} color={colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.itemData, { color: colors.text }]} numberOfLines={1}>{item.data}</Text>
          <Text style={[styles.itemDate, { color: colors.text + '80' }]}>{new Date(item.date).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteItem(index)} style={styles.deleteButton}>
        <Icon name="delete" size={24} color="#e74c3c" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{t('history.title')}</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
             <Text style={[styles.clearText, { color: colors.primary }]}>{t('history.clear')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={64} color={colors.text + '40'} />
          <Text style={[styles.emptyText, { color: colors.text + '80' }]}>{t('history.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('5%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: wp('6%'),
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  listContent: {
    padding: wp('5%'),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    marginBottom: hp('2%'),
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: wp('4%'),
  },
  textContainer: {
    flex: 1,
  },
  itemData: {
    fontSize: wp('4%'),
    fontWeight: '500',
    marginBottom: hp('0.5%'),
  },
  itemDate: {
    fontSize: wp('3%'),
  },
  deleteButton: {
    padding: wp('2%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: hp('2%'),
    fontSize: wp('4.5%'),
  },
});

export default HistoryScreen;
