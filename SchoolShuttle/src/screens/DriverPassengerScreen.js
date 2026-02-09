import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DriverPassengerScreen() {
  const todayLabel = '1/20/2025'; 
  
  // Animated Value for Scroll Position
  const scrollY = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(1);
  const [visibleHeight, setVisibleHeight] = useState(1);

  // 1. Mock Data (Enough items to force scrolling)
  const initialPassengers = [
      { id: '1', name: 'Juan dela cruz', time: '7:00AM', grade: 'Grade-5', checked: false },
      { id: '2', name: 'Rodrigo Papes', time: '6:47AM', grade: 'Grade-5', checked: false },
      { id: '3', name: 'Jesusa Cayala', time: '6:40AM', grade: 'Grade-5', checked: false },
      { id: '4', name: 'Leo Mancos', time: '6:35AM', grade: 'Grade-5', checked: false },
      { id: '5', name: 'Maca Bagow', time: '6:23AM', grade: 'Grade-5', checked: false },
      { id: '6', name: 'Malia Furiko', time: '6:15AM', grade: 'Grade-5', checked: false },
      { id: '7', name: 'Meric Furiko', time: '6:03AM', grade: 'Grade-5', checked: false },
      { id: '8', name: 'Julia Bareta', time: '5:59AM', grade: 'Grade-5', checked: false },
      { id: '9', name: 'Merald Manderson', time: '5:51AM', grade: 'Grade-5', checked: false },
      { id: '10', name: 'Chris Tyan', time: '5:48AM', grade: 'Grade-5', checked: false },
      { id: '11', name: 'Johnny Papa', time: '5:41AM', grade: 'Grade-5', checked: false },
      { id: '12', name: 'John Doe', time: '5:26AM', grade: 'Grade-5', checked: false },
      { id: '13', name: 'Jane Smith', time: '5:15AM', grade: 'Grade-5', checked: false },
      { id: '14', name: 'Mark Twain', time: '5:10AM', grade: 'Grade-5', checked: false },
      { id: '15', name: 'Alice Guo', time: '5:05AM', grade: 'Grade-5', checked: false },
      { id: '16', name: 'Bob Marley', time: '5:00AM', grade: 'Grade-5', checked: false },
      { id: '17', name: 'Charlie Puth', time: '4:55AM', grade: 'Grade-5', checked: false },
  ];

  const [passengers, setPassengers] = useState(initialPassengers);

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
          <Text style={styles.selectorLabel}>SHUTTLE A</Text>
        </View>
        <View style={styles.selectorRight}>
          <Text style={styles.dateText}>{todayLabel}</Text>
          <Ionicons name="chevron-down" size={18} color="#FCD34D" />
        </View>
      </View>

      <View style={styles.panel}>
        <View style={{flex: 1, flexDirection: 'row'}}>
            
            {/* LIST */}
            <View style={{flex: 1}}>
                <FlatList
                    data={passengers}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    
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
