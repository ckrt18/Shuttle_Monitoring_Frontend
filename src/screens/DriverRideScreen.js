import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from '../components/MapPlaceholder';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function DriverRideScreen() {
  const { user } = useContext(AuthContext);
  const [isRideActive, setIsRideActive] = useState(false);
  const [rideStatus, setRideStatus] = useState('Idle'); // Idle, In Progress, Completed
  const [shuttleId, setShuttleId] = useState(null);

  // Fetch shuttle ID on mount
  useEffect(() => {
    fetchShuttleId();
  }, []);

  const fetchShuttleId = async () => {
    try {
      // Try safe endpoint first
      const res = await api.get(`/drivers/${user.id}/assigned-shuttle`);
      if (res.data?.id) setShuttleId(res.data.id);
      else if (res.data?.shuttle?.id) setShuttleId(res.data.shuttle.id);
    } catch (e) {
      console.log("RideScreen: Could not fetch shuttle ID", e.message);
    }
  };

  const toggleRide = async () => {
    if (!shuttleId) {
      Alert.alert("Error", "No shuttle assigned. Cannot start ride.");
      return;
    }

    try {
      if (isRideActive) {
        // END RIDE
        // Endpoint: POST /api/shuttles/{id}/end (Hypothetical)
        // await api.post(`/shuttles/${shuttleId}/end`); 
        setIsRideActive(false);
        setRideStatus('Completed');
        Alert.alert("Ride Ended", "The ride has been marked as completed.");
      } else {
        // START RIDE
        // Endpoint: POST /api/shuttles/{id}/start (Hypothetical)
        // await api.post(`/shuttles/${shuttleId}/start`);
        setIsRideActive(true);
        setRideStatus('In Progress');
        Alert.alert("Ride Started", "Passengers can now see your location.");
      }
    } catch (e) {
      Alert.alert("Error", "Failed to update ride status.");
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ride Navigation</Text>
        <View style={[styles.statusBadge, { backgroundColor: isRideActive ? '#DC2626' : '#059669' }]}>
          <Text style={styles.statusText}>{isRideActive ? 'LIVE' : 'OFFLINE'}</Text>
        </View>
      </View>

      {/* MAP AREA */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 13.6218, longitude: 123.1948,
            latitudeDelta: 0.01, longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={{ latitude: 13.6218, longitude: 123.1948 }} title="My Shuttle" />
        </MapView>

        {/* Overlay Info */}
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Speed: 0 km/h</Text>
          <Text style={styles.overlayText}>Next Stop: Main Gate</Text>
        </View>
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <Text style={styles.hintText}>
          {isRideActive ? "Broadcasting location to students..." : "Ready to start route?"}
        </Text>

        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: isRideActive ? '#DC2626' : '#1E3A8A' }]}
          onPress={toggleRide}
        >
          <Ionicons name={isRideActive ? "stop-circle" : "play-circle"} size={32} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.buttonText}>
            {isRideActive ? "END RIDE" : "START RIDE"}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    paddingHorizontal: 25, paddingVertical: 20, paddingTop: 50,
    backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 4
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15 },
  statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },

  mapContainer: { flex: 1, position: 'relative' },
  map: { width: '100%', height: '100%' },

  overlay: {
    position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10, borderRadius: 10
  },
  overlayText: { color: 'white', fontWeight: 'bold', marginBottom: 2 },

  controls: {
    padding: 25, backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25,
    elevation: 10, alignItems: 'center'
  },
  hintText: { color: '#666', marginBottom: 15 },
  mainButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    width: '100%', padding: 18, borderRadius: 15, elevation: 5
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '900', letterSpacing: 1 }
});
