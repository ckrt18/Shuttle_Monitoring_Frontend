import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapPlaceholder';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import * as Location from 'expo-location';
import api from '../services/api';

// Haversine Formula for Distance (km)
// Haversine Formula Removed (Server-Side ETA Used)

export default function StudentRideScreen() {
  const { user } = useContext(AuthContext);
  const [shuttle, setShuttle] = useState(null);
  const [driver, setDriver] = useState(null);
  const [shuttleLocation, setShuttleLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eta, setEta] = useState('--');
  const [debugMsg, setDebugMsg] = useState('Initializing...');
  const [activeShuttlesList, setActiveShuttlesList] = useState([]);

  // Helper: Resolve the real student ID from the user ID (handling the 32 vs 12 mismatch)
  const resolveStudentInfo = async () => {
    let studentId = user.id;
    let studentName = user.username; // Default to username

    // 1. Try Direct Link
    try {
      const res = await api.get(`/students/${user.id}`);
      if (res.data) {
        if (res.data.studentId) studentId = res.data.studentId;
        if (res.data.fullName) studentName = res.data.fullName; // Use full name if avail
        return { studentId, studentName };
      }
    } catch (e) { }

    // 2. Try List Lookup (If direct link fails)
    try {
      const resAll = await api.get('/students');
      if (resAll.data && Array.isArray(resAll.data)) {
        // Find student where userId matches
        const match = resAll.data.find(s => s.userId == user.id);
        if (match) {
          studentId = match.id || match.studentId;
          studentName = match.fullName || match.firstName + ' ' + match.lastName;
          return { studentId, studentName };
        }
      }
    } catch (e) { }

    return { studentId, studentName };
  };

  // 1. GET USER LOCATION
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDebugMsg('Forground permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  // 2. POLL DATA
  useEffect(() => {
    let interval;
    if (user?.id) {
      fetchAssignment();
      interval = setInterval(() => {
        fetchLiveLocation();
        // Optionally refresh assignment periodically in case it changes
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [user]);

  const fetchAssignment = async () => {
    if (shuttle && (shuttle.status === 'ACTIVE' || shuttle.status === 'ON_ROUTE')) {
      fetchLiveLocationInternal(shuttle.assignedShuttleId || shuttle.shuttleId);
      setLoading(false);
      return;
    }

    try {
      // 0. RESOLVE REAL IDENTITY
      const { studentId: realStudentId, studentName } = await resolveStudentInfo();

      // ===================================================================
      // STRATEGY 1: GET /students/{id} — returns FULL object graph
      // Student.assignedShuttle → Shuttle (with driver → Driver.user)
      // This is the BEST approach: one call gets shuttle + driver + everything
      // ===================================================================
      let assignedShuttle = null;
      let driverInfo = null;

      try {
        const res = await api.get(`/students/${realStudentId}`);
        if (res.data?.assignedShuttle) {
          const s = res.data.assignedShuttle;
          assignedShuttle = {
            ...s,
            assignedShuttleId: s.shuttleId,
            // Map backend fields to display fields
            plateNumber: s.licensePlate,
            capacity: s.maxCapacity,
            vehicleType: s.name || 'Van',
          };

          // Extract driver from the FULL nested object
          if (s.driver?.user) {
            driverInfo = {
              fullName: s.driver.user.username,
              contactNumber: s.driver.contactPhone
            };
          } else if (s.driver) {
            driverInfo = {
              fullName: s.driver.contactPhone || 'Assigned Driver',
              contactNumber: s.driver.contactPhone
            };
          }
          console.log('[Ride] Got shuttle from student profile:', s.shuttleId, 'Driver:', driverInfo?.fullName);
        }
      } catch (e) { console.log('[Ride] Student profile fetch error:', e); }

      // ===================================================================
      // STRATEGY 2: Fallback to /assigned-shuttle (returns IDs only)
      // Then chain to /drivers/{id} for driver details
      // ===================================================================
      if (!assignedShuttle) {
        try {
          const res = await api.get(`/students/${realStudentId}/assigned-shuttle`);
          if (res.data) {
            assignedShuttle = {
              ...res.data,
              assignedShuttleId: res.data.shuttleId,
            };

            // Chain: get driver details
            if (res.data.driverId) {
              try {
                const driverRes = await api.get(`/drivers/${res.data.driverId}`);
                if (driverRes.data) {
                  const driverUser = driverRes.data.user;
                  driverInfo = {
                    fullName: driverUser?.username || 'Driver',
                    contactNumber: driverRes.data.contactPhone
                  };
                }
              } catch (e) { }
            }
          }
        } catch (e) { }
      }

      // ===================================================================
      // SET STATE
      // ===================================================================
      if (assignedShuttle) {
        setShuttle(assignedShuttle);
        setDriver(driverInfo || { fullName: 'Unassigned Driver' });
        fetchLiveLocationInternal(assignedShuttle.assignedShuttleId || assignedShuttle.shuttleId);
      } else {
        setDebugMsg('No shuttle assigned. Contact your school administrator.');
      }

    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveLocation = () => {
    const id = shuttle?.assignedShuttleId || shuttle?.shuttleId || shuttle?.id;
    if (id) {
      fetchLiveLocationInternal(id);
    }
  };

  const fetchLiveLocationInternal = async (shuttleId) => {
    try {
      const res = await api.get(`/eta/shuttle/${shuttleId}/students`);

      if (res.data) {
        if (res.data.shuttleLocation) {
          const { lat, lng } = res.data.shuttleLocation;
          setShuttleLocation({ latitude: lat, longitude: lng });
        }

        if (res.data.students && Array.isArray(res.data.students)) {
          const myEta = res.data.students.find(s => s.studentId === user.id);
          if (myEta && myEta.duration) {
            setEta(myEta.duration);
          } else if (res.data.students.length > 0) {
            setEta(res.data.students[0].duration || '--');
          }
        } else {
          setEta('--');
        }
      }
    } catch (e) {
      console.log("ETA Tracking error:", e);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1E3A8A" /><Text>{debugMsg}</Text></View>;
  }

  const getInitialRegion = () => {
    if (userLocation) {
      return { ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 };
    }
    return { latitude: 13.6218, longitude: 123.1948, latitudeDelta: 0.05, longitudeDelta: 0.05 };
  };

  return (
    <View style={styles.container}>
      {/* 1. BACKGROUND MAP */}
      <MapView
        style={styles.map}
        initialRegion={getInitialRegion()}
        region={shuttleLocation && userLocation ? undefined : (shuttleLocation ? { ...shuttleLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 } : undefined)}
      >
        {shuttleLocation && (
          <Marker coordinate={shuttleLocation} title={shuttle?.plateNumber || "Shuttle"}>
            <View style={styles.markerCircle}>
              <Ionicons name="bus" size={24} color="white" />
            </View>
          </Marker>
        )}

        {userLocation && (
          <Marker coordinate={userLocation} title="Me">
            <View style={styles.pinMarker}><Ionicons name="person" size={20} color="#EF4444" /></View>
          </Marker>
        )}

        {shuttleLocation && userLocation && (
          <Polyline coordinates={[userLocation, shuttleLocation]} strokeColor="#3B82F6" strokeWidth={3} />
        )}
      </MapView>

      {/* 2. TOP STATUS BANNER */}
      <SafeAreaView style={styles.topContainer}>
        <View style={styles.etaPill}>
          <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
          <Text style={styles.etaTime}>{eta}</Text>
        </View>
      </SafeAreaView>

      {/* 3. BOTTOM INFO CARD */}
      <View style={styles.bottomSheet}>
        <Text style={styles.operationTitle}>
          {shuttle ? `${shuttle.name || shuttle.vehicleType || 'Shuttle'} • ${shuttle.status || 'ACTIVE'}` : 'No Shuttle Assigned'}
        </Text>

        {shuttle ? (
          <View>
            <View style={styles.detailsRow}>
              <View style={styles.detailColumn}>
                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Vehicle:</Text> {shuttle.vehicleType || shuttle.name || 'Van'}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Plate:</Text> {shuttle.plateNumber || shuttle.licensePlate || 'N/A'}
                </Text>
              </View>
              <View style={styles.detailColumn}>
                <Text style={styles.detailText}>
                  <Text style={styles.bold}>Capacity:</Text> {shuttle.capacity || shuttle.maxCapacity || '-'}
                </Text>
                <Text style={styles.detailText}>
                  <Text style={styles.bold}>ETA:</Text> {eta}
                </Text>
              </View>
            </View>

            {/* DRIVER PROFILE CARD */}
            <View style={styles.profileCard}>
              <View style={styles.avatarContainer}>
                <Text style={{ fontSize: 30 }}>👮‍♂️</Text>
              </View>
              <View style={styles.profileTextContainer}>
                <Text style={styles.profileName}>{driver?.fullName || 'Assigned Driver'}</Text>
                <Text style={styles.profileRole}>Shuttle Driver</Text>
              </View>
              {driver?.contactNumber && (
                <TouchableOpacity style={{ backgroundColor: '#2563EB', padding: 8, borderRadius: 20 }}>
                  <Ionicons name="call" size={18} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Text style={{ textAlign: 'center', color: '#666' }}>
              {debugMsg || 'No shuttle is currently assigned to you.'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%', position: 'absolute' },
  markerCircle: { backgroundColor: '#1E3A8A', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white', elevation: 5 },
  pinMarker: { backgroundColor: 'white', padding: 5, borderRadius: 15, elevation: 3 },
  topContainer: { alignItems: 'center', marginTop: 60 },
  etaPill: { backgroundColor: '#FCD34D', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', borderWidth: 2, borderColor: '#1E3A8A', elevation: 5, width: '85%' },
  etaLabel: { color: '#1E3A8A', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  etaTime: { color: '#1E3A8A', fontWeight: '900', fontSize: 22, marginTop: 2 },
  bottomSheet: { position: 'absolute', bottom: 90, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 25, padding: 20, elevation: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 5 },
  operationTitle: { textAlign: 'center', color: '#1E3A8A', fontWeight: 'bold', fontSize: 18, marginBottom: 15 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, paddingHorizontal: 10 },
  detailColumn: { flex: 1 },
  detailText: { color: '#333', fontSize: 14, marginBottom: 5 },
  bold: { fontWeight: 'bold', color: '#1E3A8A' },
  profileCard: { backgroundColor: '#F3F4F6', borderRadius: 15, flexDirection: 'row', alignItems: 'center', padding: 10, height: 75, marginTop: 10 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 1 },
  profileTextContainer: { flex: 1 },
  profileName: { color: '#333', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  profileRole: { color: '#666', fontSize: 12, fontStyle: 'italic' },
});
