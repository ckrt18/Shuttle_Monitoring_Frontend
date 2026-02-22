import React, { useState, useRef, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Animated,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

export default function DriverPassengerScreen() {
  const { user } = useContext(AuthContext);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shuttle, setShuttle] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const todayLabel = new Date().toLocaleDateString();

  // Animated Value for Scroll Position
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [visibleHeight, setVisibleHeight] = useState(1);

  const fetchPassengers = async () => {
    try {
      setLoading(true);
      // 1. Get Assigned Shuttle
      let myShuttle = null;
      try {
        const assignedRes = await api.get(`/drivers/${user.id}/assigned-shuttle`);
        if (assignedRes.data) myShuttle = assignedRes.data.shuttle || assignedRes.data;

        // Fallback to direct driver fetch if needed
        if (!myShuttle) {
          const driverRes = await api.get(`/drivers/${user.id}`);
          if (driverRes.data?.shuttle) myShuttle = driverRes.data.shuttle;
        }
      } catch (e) { console.log("Shuttle fetch failed", e.message); }

      if (myShuttle) {
        setShuttle(myShuttle);

        // 2. Fetch Passengers
        try {
          // Optimized: Get all users and filter by shuttle ID
          // (Assuming we don't have a direct /shuttles/{id}/passengers endpoint yet)
          const usersRes = await api.get('/users');
          const myPassengers = usersRes.data.filter(u =>
            (u.role === 'STUDENT' || u.role === 'student' || u.roles?.includes('STUDENT')) &&
            (u.shuttleId == myShuttle.id || u.shuttle?.id == myShuttle.id)
          );

          // Map to UI format
          const formatted = myPassengers.map(p => ({
            id: p.id.toString(),
            name: p.fullName || p.username,
            time: '06:30 AM', // Mock time for now
            grade: p.gradeLevel || 'Student',
            checked: false
          }));
          setPassengers(formatted);

        } catch (err) {
          console.log("Error fetching students:", err);
        }
      } else {
        setPassengers([]);
      }
    } catch (e) {
      console.log("Error fetching data:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPassengers();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchPassengers();
  };

  // 2. Toggle Checkbox
  const toggleCheck = (id) => {
    const updatedList = passengers.map((p) =>
      p.id === id ? { ...p, checked: !p.checked } : p
    );
    setPassengers(updatedList);
  };

  // 3. Scroll Indicator Math
  const indicatorSize = contentHeight > visibleHeight
    ? (visibleHeight * visibleHeight) / contentHeight
    : visibleHeight;

  const difference = visibleHeight - indicatorSize;

  const scrollIndicatorPosition = Animated.multiply(
    scrollY,
    visibleHeight / contentHeight
  ).interpolate({
    inputRange: [0, contentHeight - visibleHeight],
    outputRange: [0, difference],
    extrapolate: 'clamp'
  });

  const renderItem = ({ item }) => (
    <View style={styles.rowCard}>
      <TouchableOpacity onPress={() => toggleCheck(item.id)} style={styles.checkboxContainer}>
        <Ionicons
          name={item.checked ? "checkbox" : "square-outline"}
          size={28}
          color={item.checked ? "#10B981" : "#1E3A8A"}
        />
      </TouchableOpacity>
      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      <View style={styles.rightInfo}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.grade}>{item.grade}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>List of Passengers</Text>

      <View style={styles.selectorBar}>
        <View style={styles.selectorLeft}>
          <Text style={styles.selectorLabel}>
            {shuttle ? `SHUTTLE ${shuttle.shuttleNumber}` : 'Loading...'}
          </Text>
        </View>
        <View style={styles.selectorRight}>
          <Text style={styles.dateText}>{todayLabel}</Text>
          <Ionicons name="chevron-down" size={18} color="#FCD34D" />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={{ flex: 1, flexDirection: 'row' }}>

          {/* LIST */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={passengers}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              ListEmptyComponent={<Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>No passengers found.</Text>}

              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}

              onContentSizeChange={(w, h) => setContentHeight(h)}
              onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}

              contentContainerStyle={{
                paddingTop: 15,
                paddingHorizontal: 8,
                paddingBottom: 100
              }}
            />
          </View>

          {/* CUSTOM SCROLLBAR TRACK */}
          {contentHeight > visibleHeight && (
            <View style={styles.scrollTrack}>
              <Animated.View
                style={[
                  styles.scrollThumb,
                  {
                    height: indicatorSize,
                    transform: [{ translateY: scrollIndicatorPosition }]
                  }
                ]}
              />
            </View>
          )}

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  title: {
    marginTop: 40,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },

  selectorBar: {
    marginHorizontal: 20,
    backgroundColor: '#1E3A8A',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FCD34D'
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center' },
  selectorLabel: { fontWeight: 'bold', color: '#FCD34D', fontSize: 18 },
  selectorRight: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontWeight: 'bold', color: '#FCD34D', marginRight: 5, fontSize: 18 },

  panel: {
    marginHorizontal: 15,
    backgroundColor: '#1E3A8A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flex: 1,
    paddingLeft: 5,
    paddingRight: 2,
    marginBottom: 80,
    elevation: 5,
    overflow: 'hidden'
  },

  scrollTrack: {
    width: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    marginVertical: 10,
    marginRight: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '95%'
  },
  scrollThumb: {
    width: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  rowCard: {
    backgroundColor: '#FCD34D',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 10,
  },

  checkboxContainer: { marginRight: 10, padding: 2 },
  name: { flex: 1.5, fontSize: 18, fontWeight: 'bold', color: '#1E3A8A' },
  rightInfo: { alignItems: 'flex-end', flex: 0.8 },
  time: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 2 },
  grade: { fontSize: 14, fontWeight: 'bold', color: '#1E3A8A', opacity: 0.8 },
});
