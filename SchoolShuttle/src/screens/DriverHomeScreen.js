import React, { useState } from 'react'; 
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function DriverHomeScreen() {
  
  // 1. STATE FOR NOTIFICATION TOGGLE
  const [showNotifications, setShowNotifications] = useState(false);

  // 2. MOCK NOTIFICATION DATA (Customized for Driver Context)
  const notifications = [
    { id: '1', title: 'Schedule Update', message: 'Pick up for 3pm shift starts in 10 mins.', time: '5m ago' },
    { id: '2', title: 'Route Alert', message: 'Road construction on Magsaysay Ave.', time: '1h ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
             <Image source={require('../../assets/adnu logo.png')} style={styles.headerLogo} resizeMode="cover"/>
        </View>
        <Text style={styles.headerTitle}>Ride.ADNU</Text>
        
        {/* NOTIFICATION BUTTON */}
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => setShowNotifications(!showNotifications)}
        >
           <Ionicons name="notifications" size={32} color="#1E3A8A" />
           {notifications.length > 0 && (
             <View style={styles.badge}>
               <Text style={styles.badgeText}>{notifications.length}</Text>
             </View>
           )}
        </TouchableOpacity>
      </View>

      {/* NOTIFICATION POPUP */}
      {showNotifications && (
        <View style={styles.notificationBoard}>
          <Text style={styles.notifHeader}>Notifications</Text>
          <View style={styles.separator} />
          {notifications.length === 0 ? (
            <Text style={styles.emptyText}>No new notifications</Text>
          ) : (
            notifications.map((item) => (
              <TouchableOpacity key={item.id} style={styles.notifItem}>
                <View style={styles.notifIcon}>
                  <Ionicons name="information-circle" size={24} color="#1E3A8A" />
                </View>
                <View style={styles.notifTextContainer}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifMessage}>{item.message}</Text>
                  <Text style={styles.notifTime}>{item.time}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* GREETING */}
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subGreeting}>You are driving <Text style={{fontWeight:'bold', color:'#1E3A8A'}}>SHUTTLE A</Text></Text>

        {/* DASHBOARD GRID */}
        <View style={styles.grid}>
          {/* Card 1: Distance */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>3km</Text>
            <Text style={styles.cardLabel}>Distance from next stop</Text>
          </View>

          {/* Card 2: Passengers On Board */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>12</Text>
            <Text style={styles.cardLabel}>Passengers on shuttle</Text>
          </View>

          {/* Card 3: Weather */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="sunny" size={24} color="#F59E0B" style={{marginRight: 5}} />
                <Text style={styles.bigNumber}>29°</Text>
            </View>
            <Text style={styles.cardLabel}>Sunny</Text>
          </View>

          {/* Card 4: Pickup Count */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>6 more</Text>
            <Text style={styles.cardLabel}>Passengers to pickup</Text>
          </View>
        </View>

        {/* MAP VIEW */}
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: 13.6218, longitude: 123.1948,
              latitudeDelta: 0.01, longitudeDelta: 0.01,
            }}
          >
             <Marker coordinate={{latitude: 13.6218, longitude: 123.1948}} title="My Location" />
          </MapView>
          {/* Bus Icon Overlay */}
          <View style={styles.mapBusIcon}>
             <Ionicons name="bus" size={20} color="white" />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  
  // Header
  topBar: {
    backgroundColor: '#FCD34D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 25, paddingVertical: 15, paddingTop: 50, elevation: 4, zIndex: 10,
  },
  logoContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', overflow: 'hidden', elevation: 2 },
  headerLogo: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E3A8A' },
  notificationBtn: { position: 'relative', padding: 5 },
  
  // Notification Board
  notificationBoard: {
    position: 'absolute', top: 110, right: 20, width: 300, backgroundColor: 'white', borderRadius: 15, padding: 15,
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
    zIndex: 999, borderWidth: 1, borderColor: '#eee',
  },
  notifHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  notifItem: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-start' },
  notifIcon: { marginRight: 10, marginTop: 2 },
  notifTextContainer: { flex: 1 },
  notifTitle: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  notifMessage: { color: '#666', fontSize: 12, marginVertical: 2 },
  notifTime: { color: '#999', fontSize: 10 },
  emptyText: { textAlign: 'center', color: '#999', fontStyle: 'italic', padding: 10 },
  badge: { position: 'absolute', top: 2, right: 2, backgroundColor: 'red', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#FCD34D' },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  // Content
  scrollContent: { padding: 25, paddingBottom: 130 },
  greeting: { fontSize: 34, fontWeight: 'bold', color: '#1E3A8A', marginTop: 15 },
  subGreeting: { fontSize: 16, color: '#666', marginBottom: 25 },
  
  // Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: '#FCD34D', borderRadius: 25, padding: 15, marginBottom: 18, 
    alignItems: 'center', justifyContent: 'center', height: 110, // Exact Match
    borderWidth: 1.5, borderColor: '#1E3A8A', elevation: 3,
  },
  bigNumber: { fontSize: 28, fontWeight: '900', color: '#1E3A8A', marginBottom: 5 },
  cardLabel: { fontSize: 12, color: '#333', fontWeight: '500', textAlign: 'center' },

  // Map
  mapContainer: { height: 250, borderRadius: 25, overflow: 'hidden', marginTop: 1, borderWidth: 1.5, borderColor: '#1E3A8A', position: 'relative' },
  map: { width: '100%', height: '100%' },
  mapBusIcon: { position: 'absolute', top: 20, left: 20, backgroundColor: '#1E3A8A', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' }
});
