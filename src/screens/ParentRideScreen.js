import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from '../components/MapPlaceholder';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function ParentRideScreen() {
  const { user } = useContext(AuthContext);
  const [child, setChild] = useState(null);
  const [shuttle, setShuttle] = useState(null);
  const [eta, setEta] = useState('...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchRideDetails();
  }, [user]);

  const fetchRideDetails = async () => {
    try {
      // 1. Get Children
      const studentsRes = await api.get(`/students/parent/${user.id}`);
      if (studentsRes.data && studentsRes.data.length > 0) {
        const student = studentsRes.data[0]; // Default to first child
        setChild(student);

        // 2. Get Shuttle
        const shuttleRes = await api.get(`/students/${student.id}/assigned-shuttle`);
        if (shuttleRes.data?.assignedShuttleId) {
          // 3. Get Shuttle Status/ETA
          const trackRes = await api.get(`/shuttles/${shuttleRes.data.assignedShuttleId}`);
          setShuttle(trackRes.data);
          setEta(trackRes.data.eta || '15 mins');
        }
      }
    } catch (e) {
      console.log('Error fetching ride:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#1E3A8A" /></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{ latitude: 13.6218, longitude: 123.1948, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      >
        {/* Mock Route for visual */}
        <Polyline coordinates={[{ latitude: 13.6218, longitude: 123.1948 }, { latitude: 13.6300, longitude: 123.2000 }]} strokeColor="#3B82F6" strokeWidth={4} />

        {/* Shuttle Location */}
        <Marker coordinate={{ latitude: 13.6218, longitude: 123.1948 }}>
          <View style={styles.markerCircle}><Ionicons name="bus" size={20} color="white" /></View>
        </Marker>
      </MapView>

      <SafeAreaView style={styles.topContainer}>
        <View style={styles.etaPill}>
          <Text style={styles.etaLabel}>{child ? `${child.fullName}'s Arrival` : "Child's Arrival"}</Text>
          <Text style={styles.etaTime}>{eta}</Text>
        </View>
      </SafeAreaView>

      <View style={styles.bottomSheet}>
        <Text style={styles.operationTitle}>Tracking: {child?.fullName || 'Student'}</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}><Text style={{ fontSize: 30 }}>👤</Text></View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>{child?.fullName || 'Student Name'}</Text>
            <Text style={styles.profileRole}>
              {shuttle ? `Shuttle ${shuttle.shuttleNumber} • On Route` : 'No Active Ride'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: '100%', position: 'absolute' },
  markerCircle: { backgroundColor: '#1E3A8A', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  topContainer: { alignItems: 'center', marginTop: 60 },
  etaPill: { backgroundColor: '#FCD34D', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', borderWidth: 2, borderColor: '#1E3A8A', elevation: 5, width: '90%' },
  etaLabel: { color: '#1E3A8A', fontWeight: 'bold', fontSize: 13, textTransform: 'uppercase' },
  etaTime: { color: '#1E3A8A', fontWeight: '900', fontSize: 22, marginTop: 2 },
  bottomSheet: { position: 'absolute', bottom: 120, left: 20, right: 20, backgroundColor: '#FCD34D', borderRadius: 25, padding: 15, borderWidth: 2, borderColor: '#1E3A8A', elevation: 8 },
  operationTitle: { textAlign: 'center', color: '#1E3A8A', fontWeight: 'bold', fontSize: 15, marginBottom: 10 },
  profileCard: { backgroundColor: '#1E3A8A', borderRadius: 15, flexDirection: 'row', alignItems: 'center', padding: 10, height: 70 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileTextContainer: { flex: 1 },
  profileName: { color: '#FCD34D', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  profileRole: { color: '#ccc', fontSize: 11, fontStyle: 'italic' },
});
