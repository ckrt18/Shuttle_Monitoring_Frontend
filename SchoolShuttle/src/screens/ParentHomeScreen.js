import React, { useState } from 'react'; // Added useState
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function ParentHomeScreen() {
  // 1. STATE FOR NOTIFICATION TOGGLE
  const [showNotifications, setShowNotifications] = useState(false);

  // 2. MOCK NOTIFICATION DATA (Customized for Parent Context)
  const notifications = [
    { id: '1', title: 'Shuttle Arrived', message: 'Your child has arrived at school.', time: '2m ago' },
    { id: '2', title: 'Balance Alert', message: 'Your balance is below P500.', time: '1d ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* TOP HEADER */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
             <Image source={require('../../assets/adnu logo.png')} style={styles.headerLogo} resizeMode="cover"/>
        </View>
        <Text style={styles.headerTitle}>Ride.ADNU</Text>
        
        {/* 3. UPDATED BUTTON WITH ONPRESS HANDLER */}
        <TouchableOpacity 
          style={styles.notificationBtn}
          onPress={() => setShowNotifications(!showNotifications)}
        >
           <Ionicons name="notifications" size={32} color="#1E3A8A" />
           {/* Badge logic: Only show if there are notifications */}
           {notifications.length > 0 && (
             <View style={styles.badge}>
               <Text style={styles.badgeText}>{notifications.length}</Text>
             </View>
           )}
        </TouchableOpacity>
      </View>

      {/* 4. FLOATING NOTIFICATION BOARD (Inserted here) */}
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
        
        {/* GREETING - MATCHING PHOTO */}
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subGreeting}>Your child's journey is safe and monitored.</Text>

        {/* GRID SYSTEM */}
        <View style={styles.grid}>
          
          {/* Card 1: Status */}
          <View style={styles.card}>
            <Text style={styles.statusText}>Ready and waiting</Text>
            <Text style={styles.cardLabel}>Your child's Status</Text>
          </View>

          {/* Card 2: ETA */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>15 mins</Text>
            <Text style={styles.cardLabel}>Shuttle's ETA</Text>
          </View>

          {/* Card 3: Ride Count */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>14</Text>
            <Text style={styles.cardLabel}>Ride Count</Text>
          </View>

          {/* Card 4: BALANCE - NEW for Parent */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>P3,000</Text>
            <Text style={styles.cardLabel}>Current balance</Text>
          </View>
        </View>

        {/* MAP PREVIEW */}
        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: 13.6218, longitude: 123.1948,
              latitudeDelta: 0.01, longitudeDelta: 0.01,
            }}
          >
             <Marker coordinate={{latitude: 13.6218, longitude: 123.1948}} title="Shuttle" />
          </MapView>
          {/* Small Bus Icon Overlay like in photo */}
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
  topBar: {
    backgroundColor: '#FCD34D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 25, paddingVertical: 15, paddingTop: 50, elevation: 4, zIndex: 10, // Added zIndex here so it stays above map if needed
  },
  logoContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', overflow: 'hidden', elevation: 2 },
  headerLogo: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E3A8A' },
  notificationBtn: { position: 'relative', padding: 5 },
  
  // 5. ADDED NOTIFICATION STYLES
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
  scrollContent: { padding: 25, paddingBottom: 130 },
  greeting: { fontSize: 34, fontWeight: 'bold', color: '#1E3A8A', marginTop: 15 },
  subGreeting: { fontSize: 16, color: '#666', marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: '#FCD34D', borderRadius: 25, padding: 15, marginBottom: 18, 
    alignItems: 'center', justifyContent: 'center', height: 110, 
    borderWidth: 1.5, borderColor: '#1E3A8A', elevation: 3,
  },
  statusText: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 5, textAlign: 'center' },
  bigNumber: { fontSize: 28, fontWeight: '900', color: '#1E3A8A', marginBottom: 5 },
  cardLabel: { fontSize: 12, color: '#333', fontWeight: '500' },
  mapContainer: { height: 250, borderRadius: 25, overflow: 'hidden', marginTop: 1, borderWidth: 1.5, borderColor: '#1E3A8A', position: 'relative' },
  map: { width: '100%', height: '100%' },
  mapBusIcon: { position: 'absolute', top: 20, left: 20, backgroundColor: '#1E3A8A', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' }
});
