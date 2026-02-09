import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function ParentRideScreen() {
  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{ latitude: 13.4470, longitude: 123.4100, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      >
        <Polyline coordinates={[{ latitude: 13.4500, longitude: 123.4000 }, { latitude: 13.4400, longitude: 123.4200 }]} strokeColor="#3B82F6" strokeWidth={4} />
        <Marker coordinate={{ latitude: 13.4500, longitude: 123.4000 }}><View style={styles.markerCircle}><Ionicons name="bus" size={20} color="white" /></View></Marker>
        <Marker coordinate={{ latitude: 13.4400, longitude: 123.4200 }}><View style={styles.pinMarker}><Ionicons name="location" size={30} color="#EF4444" /></View></Marker>
      </MapView>

      <SafeAreaView style={styles.topContainer}>
        <View style={styles.etaPill}>
          <Text style={styles.etaLabel}>Child's Arrival ETA</Text>
          <Text style={styles.etaTime}>15 mins</Text>
        </View>
      </SafeAreaView>

      <View style={styles.bottomSheet}>
        <Text style={styles.operationTitle}>Tracking: Chamie Kai (Student)</Text>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}><Text style={{fontSize: 30}}>👤</Text></View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName}>Chamie Kai</Text>
            <Text style={styles.profileRole}>On Board - Going Home</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%', position: 'absolute' },
  markerCircle: { backgroundColor: '#1E3A8A', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white' },
  topContainer: { alignItems: 'center', marginTop: 60 },
  etaPill: { backgroundColor: '#FCD34D', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 30, alignItems: 'center', borderWidth: 2, borderColor: '#1E3A8A', elevation: 5, width: '85%' },
  etaLabel: { color: '#1E3A8A', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  etaTime: { color: '#1E3A8A', fontWeight: '900', fontSize: 22, marginTop: 2 },
  bottomSheet: { position: 'absolute', bottom: 120, left: 20, right: 20, backgroundColor: '#FCD34D', borderRadius: 25, padding: 15, borderWidth: 2, borderColor: '#1E3A8A', elevation: 8 },
  operationTitle: { textAlign: 'center', color: '#1E3A8A', fontWeight: 'bold', fontSize: 15, marginBottom: 10 },
  profileCard: { backgroundColor: '#1E3A8A', borderRadius: 15, flexDirection: 'row', alignItems: 'center', padding: 10, height: 70 },
  avatarContainer: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  profileTextContainer: { flex: 1 },
  profileName: { color: '#FCD34D', fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  profileRole: { color: '#ccc', fontSize: 11, fontStyle: 'italic' },
});
