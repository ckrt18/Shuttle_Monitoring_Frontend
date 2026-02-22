import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity
} from 'react-native';
import MapView, { Marker } from '../components/MapPlaceholder';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function DriverHomeScreen() {
  const { user, logout } = React.useContext(AuthContext); // Added logout
  const [driver, setDriver] = useState(null);
  const [shuttle, setShuttle] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. STATE FOR NOTIFICATION TOGGLE
  const [showNotifications, setShowNotifications] = useState(false);

  // 2. MOCK NOTIFICATION DATA (Customized for Driver Context)
  const notifications = [
    { id: '1', title: 'Schedule Update', message: 'Pick up for 3pm shift starts in 10 mins.', time: '5m ago' },
  ];

  React.useEffect(() => {
    if (user?.id) fetchDriverData();
  }, [user]);

  const fetchDriverData = async () => {
    try {
      console.log("Fetching driver data for ID:", user.id);
      let driverData = user;
      try {
        const res = await api.get(`/users/${user.id}`);
        driverData = res.data;
      } catch (e) { console.log("User fetch failed, using context user"); }

      setDriver(driverData);

      // ATTEMPT TO FETCH SHUTTLE
      // Strategy: Since /shuttles is broken (500), and specific /drivers/{id} might be flaky
      // Let's try fetching ALL drivers and finding ourselves.
      try {
        const driversRes = await api.get('/users/role/DRIVER'); // Hypothetical endpoint
        // Or if that doesn't exist, try /users and filter? (Expensive but might work)
        // const usersRes = await api.get('/users');

        // Let's rely on the previous probe hint or try a new approach
        // If the probe for /drivers/{id} returned 200 but no shuttle, maybe it's in a different field?

        // RETRY: /drivers/{id} but log EVERYTHING
        const driverRes = await api.get(`/drivers/${user.id}`);
        setShuttleDebugData([{ id: 'DriverEndpoint', data: driverRes.data }]);

        if (driverRes.data && (driverRes.data.shuttle || driverRes.data.assignedShuttle)) {
          setShuttle(driverRes.data.shuttle || driverRes.data.assignedShuttle);
          setFetchError(null);
        } else {
          // If that fails, let's try the "Assigned Shuttle" pattern from Student Home
          // Maybe /drivers/{id}/assigned-shuttle exists?
          try {
            const assignedRes = await api.get(`/drivers/${user.id}/assigned-shuttle`);
            if (assignedRes.data) {
              setShuttle(assignedRes.data);
              setFetchError(null);
            } else {
              setFetchError("No shuttle found in Driver profile or assignments.");
            }
          } catch (errAssign) {
            console.log("Assigned shuttle fetch failed:", errAssign.message);
            setFetchError("Could not find assigned shuttle.");
          }
        }

      } catch (e) {
        console.log("Driver fetch error:", e.message);
        setFetchError(`Driver Fetch Error: ${e.message}`);
      }

    } catch (e) {
      console.log("Error in driver fetch:", e);
      setFetchError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const [probeResults, setProbeResults] = useState([]);

  const runEndpointProbe = async (id) => {
    const endpoints = [
      `/drivers/${id}`,
      `/drivers/${id}/shuttle`,
      `/shuttles/driver/${id}`,
      `/shuttles/assigned`,
      `/shuttles/active`,
      `/users/${id}/shuttle`
    ];

    const results = [];
    for (const ep of endpoints) {
      try {
        const res = await api.get(ep);
        results.push(`[${res.status}] ${ep} -> ${Object.keys(res.data || {}).join(',')}`);
        // If we find a shuttle here, grab it!
        if (res.data && (res.data.shuttleNumber || res.data.plateNumber)) {
          setShuttle(res.data);
          setFetchError(null);
          return; // Stop if found
        }
        if (res.data && res.data.shuttle) {
          setShuttle(res.data.shuttle);
          setFetchError(null);
          return;
        }
      } catch (e) {
        results.push(`[${e.response?.status || 'Err'}] ${ep}`);
      }
    }
    setProbeResults(results);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      {/* HEADER */}
      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.logoContainer}>
            <Image source={require('../../assets/adnu logo.png')} style={styles.headerLogo} resizeMode="cover" />
          </View>
          <Text style={styles.headerTitle}>Ride.ADNU</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* LOGOUT BUTTON */}
          <TouchableOpacity
            onPress={async () => {
              console.log("Logout pressed");
              await logout();
            }}
            style={styles.actionBtn}
          >
            <Ionicons name="log-out-outline" size={28} color="#1E3A8A" />
          </TouchableOpacity>

          {/* NOTIFICATION BUTTON */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Ionicons name="notifications" size={28} color="#1E3A8A" />
            {notifications.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
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
        <Text style={styles.subGreeting}>
          Driver <Text style={{ fontWeight: 'bold', color: '#1E3A8A' }}>{driver?.fullName || user?.username}</Text>
        </Text>

        {shuttle ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: '#444' }}>Assigned to:</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E3A8A' }}>
              SHUTTLE {shuttle.shuttleNumber || 'Unknown'}
            </Text>
            <Text style={{ color: '#666' }}>Plate: {shuttle.plateNumber}</Text>
            <Text style={{ color: '#666' }}>Status: {shuttle.status}</Text>
          </View>
        ) : (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ marginBottom: 5, color: 'red', fontWeight: 'bold' }}>No Shuttle Assigned</Text>
            <Text style={{ fontSize: 10, color: '#999' }}>My ID: {user.id}</Text>

            <Text style={{ fontSize: 10, color: '#555', marginTop: 5, fontWeight: 'bold' }}>Debug Data:</Text>
            {fetchError && <Text style={{ fontSize: 10, color: 'red' }}>{fetchError}</Text>}

            {/* Fallback View if No Shuttle */}
            <View style={{ marginBottom: 20, padding: 15, backgroundColor: '#FFE4E6', borderRadius: 10 }}>
              <Text style={{ color: '#E11D48', fontWeight: 'bold' }}>No Shuttle Assigned</Text>
              <Text style={{ color: '#BE123C', fontSize: 12, marginTop: 5 }}>
                Please contact the operator to assign a shuttle to your account.
              </Text>
            </View>
          </View>
        )}


        {/* DASHBOARD GRID */}
        <View style={styles.grid}>
          {/* Card 1: Distance */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>--</Text>
            <Text style={styles.cardLabel}>Distance</Text>
          </View>

          {/* Card 2: Passengers On Board */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>{shuttle?.currentCapacity || 0}</Text>
            <Text style={styles.cardLabel}>Passengers Onboard</Text>
          </View>

          {/* Card 3: Weather */}
          <View style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="sunny" size={24} color="#F59E0B" style={{ marginRight: 5 }} />
              <Text style={styles.bigNumber}>29°</Text>
            </View>
            <Text style={styles.cardLabel}>Sunny</Text>
          </View>

          {/* Card 4: Pickup Count */}
          <View style={styles.card}>
            <Text style={styles.bigNumber}>{shuttle?.capacity - (shuttle?.currentCapacity || 0)}</Text>
            <Text style={styles.cardLabel}>Seats Available</Text>
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
            <Marker coordinate={{ latitude: 13.6218, longitude: 123.1948 }} title="My Location" />
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
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E3A8A', marginLeft: 10 },
  actionBtn: { padding: 8, marginLeft: 5, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)' },
  notificationBtn: { position: 'relative' },

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
