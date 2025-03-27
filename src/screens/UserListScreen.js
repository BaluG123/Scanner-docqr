import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image 
} from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue
} from 'react-native-reanimated';
import { FlashList } from '@shopify/flash-list';
import { 
  widthPercentageToDP as wp, 
  heightPercentageToDP as hp 
} from 'react-native-responsive-screen';

const SkeletonItem = () => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.skeletonItem, animatedStyle]}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonTextContainer}>
        <View style={styles.skeletonName} />
        <View style={styles.skeletonRole} />
      </View>
    </Animated.View>
  );
};

const UserListScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      const mockData = [
        { 
          id: '1', 
          name: 'John Doe', 
          role: 'Software Engineer',
          image: 'https://i.pravatar.cc/150?img=1'
        },
        { 
          id: '2', 
          name: 'Jane Smith', 
          role: 'Product Manager',
          image: 'https://i.pravatar.cc/150?img=2'
        },
        { 
          id: '3', 
          name: 'Mike Johnson', 
          role: 'Designer',
          image: 'https://i.pravatar.cc/150?img=3'
        },
        { 
          id: '4', 
          name: 'Sarah Williams', 
          role: 'UX Researcher',
          image: 'https://i.pravatar.cc/150?img=4'
        },
        { 
          id: '5', 
          name: 'David Chen', 
          role: 'Frontend Developer',
          image: 'https://i.pravatar.cc/150?img=5'
        },
        { 
          id: '6', 
          name: 'Emily Brown', 
          role: 'Backend Engineer',
          image: 'https://i.pravatar.cc/150?img=6'
        },
        { 
          id: '7', 
          name: 'Alex Thompson', 
          role: 'DevOps Engineer',
          image: 'https://i.pravatar.cc/150?img=7'
        },
        { 
          id: '8', 
          name: 'Lisa Anderson', 
          role: 'QA Engineer',
          image: 'https://i.pravatar.cc/150?img=8'
        },
        { 
          id: '9', 
          name: 'Robert Taylor', 
          role: 'System Architect',
          image: 'https://i.pravatar.cc/150?img=9'
        },
        { 
          id: '10', 
          name: 'Maria Garcia', 
          role: 'Mobile Developer',
          image: 'https://i.pravatar.cc/150?img=10'
        }
      ];

      setData(mockData);
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, []);

  const UserItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.avatar}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>User List</Text>
      {isLoading ? (
        <FlashList
          data={Array(10).fill(1)}
          renderItem={() => <SkeletonItem />}
          keyExtractor={(_, index) => index.toString()}
          estimatedItemSize={100}
        />
      ) : (
        <FlashList
          data={data}
          renderItem={({ item }) => <UserItem item={item} />}
          keyExtractor={(item) => item.id}
          estimatedItemSize={100}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: wp('4%')
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center'
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    backgroundColor: '#E1E9EE',
    padding: wp('4%'),
    borderRadius: 8
  },
  skeletonAvatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: '#C5CED8'
  },
  skeletonTextContainer: {
    marginLeft: wp('4%'),
    flex: 1
  },
  skeletonName: {
    width: '70%',
    height: 20,
    marginBottom: 10,
    backgroundColor: '#C5CED8'
  },
  skeletonRole: {
    width: '50%',
    height: 15,
    backgroundColor: '#C5CED8'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    backgroundColor: 'white',
    padding: wp('4%'),
    borderRadius: 8
  },
  avatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    backgroundColor: '#E1E9EE'
  },
  textContainer: {
    marginLeft: wp('4%'),
    flex: 1
  },
  name: {
    fontSize: wp('4%'),
    fontWeight: 'bold'
  },
  role: {
    fontSize: wp('3.5%'),
    color: 'gray'
  }
});

export default UserListScreen; 