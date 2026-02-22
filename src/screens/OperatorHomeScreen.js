import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity
} from 'react-native';
import MapView, { Marker } from '../components/MapPlaceholder';
import { Ionicons } from '@expo/vector-icons';

export default function OperatorHomeScreen() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShuttleDropdown, setShowShuttleDropdown] = useState(false);
  const [selectedShuttle, setSelectedShuttle] = useState('Shuttle A');

  const notifications = [
    { id: '1', title: 'Shuttle A Delay', message: 'Traffic on Magsaysay Ave.', time: '3m ago' },
    { id: '2', title: 'Driver Check-in', message: 'Kuya Ben marked present.', time: '10m ago' },
  ];

  const shuttleOptions = ['Shuttle A', 'Shuttle B', 'Shuttle C'];

  const selectShuttle = (shuttle) => {
    setSelectedShuttle(shuttle);
    setShowShuttleDropdown(false);
  };

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

      {/* NOTIFICATION BOARD */}
      {showNotifications && (
        <View style={styles.notificationBoard}>
          <Text style={styles.notifHeader}>Notifications</Text>
          <View style={styles.separator} />
          {notifications.map((item) => (
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
          ))}
        </View>
      )}

      {/* ✅ SHUTTLE DROPDOWN MODAL OVERLAY - ALWAYS ON TOP */}
      {showShuttleDropdown && (
        <View style={styles.dropdownOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setShowShuttleDropdown(false)}
            activeOpacity={1}
          />
          <View style={styles.dropdownModal}>
            {shuttleOptions.map((shuttle, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dropdownItemModal,
                  index === shuttleOptions.length - 1 && { borderBottomWidth: 0 }
                ]}
                onPress={() => selectShuttle(shuttle)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownItemTextModal}>{shuttle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* GREETING */}
        <Text style={styles.greeting}>Good Morning!</Text>
        <Text style={styles.subGreeting}>shuttle network made simple</Text>

        {/* 4 CARDS GRID */}
        <View style={styles.grid}>
          {/* Card 1: Shuttles Active */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>2</Text>
            <Text style={styles.cardLabel}>Shuttles Active</Text>
          </View>

          {/* Card 2: Drivers Attendance */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>2/2</Text>
            <Text style={styles.cardLabel}>Drivers Attendance</Text>
          </View>

          {/* Card 3: Total Passengers WITH IMPROVED DROPDOWN BUTTON */}
          <View style={styles.passengerCard}>
            <Text style={styles.bigNumber}>20</Text>
            <Text style={styles.cardLabel}>Total Passengers</Text>

            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowShuttleDropdown(!showShuttleDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.dropdownText}>{selectedShuttle}</Text>
              <Ionicons
                name={showShuttleDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color="#1E3A8A"
              />
            </TouchableOpacity>
          </View>

          {/* Card 4: Quick Memo Button */}
          <TouchableOpacity style={[styles.card, styles.memoCard]}>
            <Text style={styles.memoText}>Create a quick</Text>
            <Text style={styles.memoText}>memo</Text>
          </TouchableOpacity>
        </View>

        {/* MAP - UNCHANGED */}
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
            <Marker coordinate={{ latitude: 13.6218, longitude: 123.1948 }} title="Shuttle A" />
          </MapView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  // Header styles
  topBar: {
    backgroundColor: '#FCD34D', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 25, paddingVertical: 15, paddingTop: 50, zIndex: 1000, elevation: 4,
  },
  logoContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', overflow: 'hidden', elevation: 2 },
  headerLogo: { width: '100%', height: '100%' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E3A8A', letterSpacing: 0.5 },
  notificationBtn: { padding: 5 },

  // Notification board
  notificationBoard: {
    position: 'absolute', top: 110, right: 20, width: 300, backgroundColor: 'white', borderRadius: 15, padding: 15,
    elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
    zIndex: 2000, borderWidth: 1, borderColor: '#eee',
  },
  notifHeader: { fontSize: 18, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 5 },
  separator: { height: 1, backgroundColor: '#eee', marginBottom: 10 },
  notifItem: { flexDirection: 'row', marginBottom: 15, alignItems: 'flex-start' },
  notifIcon: { marginRight: 10, marginTop: 2 },
  notifTextContainer: { flex: 1 },
  notifTitle: { fontWeight: 'bold', color: '#333', fontSize: 14 },
  notifMessage: { color: '#666', fontSize: 12, marginVertical: 2 },
  notifTime: { color: '#999', fontSize: 10 },

  // Content
  scrollContent: { padding: 25, paddingBottom: 130 },
  greeting: { fontSize: 34, fontWeight: 'bold', color: '#1E3A8A', marginTop: 5 },
  subGreeting: { fontSize: 16, color: '#666', marginBottom: 25 },

  // Cards
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%', backgroundColor: '#FCD34D', borderRadius: 25, padding: 20, marginBottom: 18,
    alignItems: 'center', justifyContent: 'center', height: 100,
    borderWidth: 1.5, borderColor: '#1E3A8A', elevation: 3,
  },

  // Passenger card
  passengerCard: {
    width: '48%', backgroundColor: '#FCD34D', borderRadius: 25, padding: 8, marginBottom: 18,
    alignItems: 'center', justifyContent: 'space-between', height: 100,
    borderWidth: 1.5, borderColor: '#1E3A8A', elevation: 3,
  },

  // ✅ IMPROVED DROPDOWN BUTTON - LARGER & BETTER VISUALS
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1E3A8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 4,
  },
  dropdownText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
    marginRight: 6,
    letterSpacing: 0.3,
  },

  // ✅ MODAL OVERLAY - GUARANTEES VISIBILITY
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5000,  // HIGHEST Z-INDEX
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',  // Semi-transparent backdrop
  },
  dropdownModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#1E3A8A',
    elevation: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minWidth: 160,
    maxHeight: 200,
  },
  dropdownItemModal: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  dropdownItemTextModal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    letterSpacing: 0.5,
  },

  // Other cards
  memoCard: { justifyContent: 'center', padding: 20 },
  memoText: {
    fontSize: 12, fontWeight: '600', color: '#1E3A8A', textAlign: 'center', lineHeight: 14
  },
  bigNumber: { fontSize: 28, fontWeight: '900', color: '#1E3A8A', marginBottom: 1 },
  cardLabel: { fontSize: 12, color: '#333', fontWeight: '600', textAlign: 'center' },

  // Map - UNCHANGED
  mapContainer: { height: 300, borderRadius: 25, overflow: 'hidden', marginTop: 5, borderWidth: 2, borderColor: '#1E3A8A' },
  map: { width: '100%', height: '100%' },
});
