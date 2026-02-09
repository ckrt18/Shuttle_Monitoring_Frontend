import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity 
} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; 
import { Ionicons } from '@expo/vector-icons'; 

// RENAMED FUNCTION
export default function StudentHomeScreen() {
  
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: '1', title: 'Shuttle Arriving', message: 'The shuttle is 5 mins away.', time: '2m ago' },
    { id: '2', title: 'Route Update', message: 'Traffic heavy near Naga center.', time: '15m ago' },
    { id: '3', title: 'Ride Completed', message: 'You have arrived safely.', time: '1h ago' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
             <Image 
               source={require('../../assets/adnu logo.png')} 
               style={styles.headerLogo} 
               resizeMode="cover"
             />
        </View>
        <Text style={styles.headerTitle}>Ride.ADNU</Text>
        <TouchableOpacity 
          style={styles.notificationBtn} 
          onPress={() => setShowNotifications(!showNotifications)}
        >
           <Ionicons name="notifications" size={32} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* FLOATING NOTIFICATION BOARD */}
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
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subGreeting}>Rise and shine, stay safe</Text>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.statusText}>Ready and waiting</Text>
            <Text style={styles.cardLabel}>Student Status</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.bigNumber}>15 mins</Text>
            <Text style={styles.cardLabel}>Shuttle's ETA</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.bigNumber}>☀️ 29°</Text>
            <Text style={styles.cardLabel}>Sunny!</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.bigNumber}>14</Text>
            <Text style={styles.cardLabel}>Ride Count</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: 13.6218, 
              longitude: 123.1948,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
             <Marker coordinate={{latitude: 13.6218, longitude: 123.1948}} title="My Shuttle" />
          </MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  topBar: {
    backgroundColor: '#FCD34D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 25, paddingVertical: 15, paddingTop: 50, zIndex: 10, elevation: 4,
  },
  logoContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', overflow: 'hidden', elevation: 2 },
  headerLogo: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E3A8A', letterSpacing: 0.5 },
  notificationBtn: { padding: 5 },
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
  scrollContent: { padding: 25, paddingBottom: 130 },
  greeting: { fontSize: 34, fontWeight: 'bold', color: '#1E3A8A', marginTop: 15 },
  subGreeting: { fontSize: 16, color: '#666', marginBottom: 25 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: '#FCD34D', borderRadius: 25, padding: 15, marginBottom: 18, alignItems: 'center',
    justifyContent: 'center', height: 100, borderWidth: 1.5, borderColor: '#1E3A8A', elevation: 3,
  },
  statusText: { fontSize: 20, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 5, textAlign: 'center' },
  bigNumber: { fontSize: 32, fontWeight: '900', color: '#1E3A8A', marginBottom: 5 },
  cardLabel: { fontSize: 14, color: '#333', fontWeight: '500' },
  mapContainer: { height: 300, borderRadius: 25, overflow: 'hidden', marginTop: 1, borderWidth: 2, borderColor: '#1E3A8A' },
  map: { width: '100%', height: '100%' },
});
