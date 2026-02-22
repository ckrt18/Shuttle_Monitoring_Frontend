import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Modal
} from 'react-native';
import MapView, { Marker } from '../components/MapPlaceholder';
import { Ionicons } from '@expo/vector-icons';

// Specific Color Palette
const COLORS = {
  bgLight: '#E8EDF2',
  primaryBlue: '#2D398D',
  accentYellow: '#FFD75E',
  textBlue: '#1E2756',
  statusGreen: '#4ADE80',
};

export default function ShuttleManagementScreen() {
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedShuttle, setSelectedShuttle] = useState('');

  const ShuttleCard = ({ title, route }) => (
    <View style={styles.shuttleCard}>
      <View style={styles.shuttleContent}>
        <View style={styles.shuttleHeader}>
          <Text style={styles.shuttleTitle}>{title}</Text>
          <View style={styles.statusDot} />
        </View>
        <Text style={styles.routeText}>{route}</Text>

        <TouchableOpacity style={styles.yellowPillButton}>
          <Text style={styles.buttonText}>Shuttle Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.yellowPillButton}>
          <Text style={styles.buttonText}>Passengers</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ CLICKABLE ROUTE MAP - OPENS FULL MAP MODAL */}
      <TouchableOpacity
        style={styles.routeThumbContainer}
        onPress={() => {
          setSelectedShuttle(title);
          setShowMapModal(true);
        }}
        activeOpacity={0.7}
      >
        <View style={styles.mapPreview}>
          <Ionicons name="map-outline" size={28} color={COLORS.accentYellow} />
        </View>
        <Text style={styles.routeLabel}>Route</Text>
      </TouchableOpacity>
    </View>
  );

  const DriverItem = ({ name }) => (
    <View style={styles.driverRow}>
      <Text style={styles.driverName} numberOfLines={1}>{name}</Text>
      <TouchableOpacity style={styles.manageButton}>
        <Text style={styles.manageText}>Manage</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Top Header Selector */}
        <TouchableOpacity style={styles.headerSelector}>
          <Text style={styles.headerText}>
            Choose a shuttle  <Text style={{ color: COLORS.primaryBlue }}>2/2</Text>
          </Text>
        </TouchableOpacity>

        {/* Shuttle List */}
        <ShuttleCard title="SHUTTLE A" route="RINCONADA TO ADNU PACOL" />
        <ShuttleCard title="SHUTTLE B" route="PILI TO ADNU PACOL" />

        {/* Drivers Section */}
        <View style={styles.driversContainer}>
          <View style={styles.driversHeaderPill}>
            <Text style={styles.driversHeaderText}>Drivers</Text>
          </View>

          <View style={styles.driverList}>
            <DriverItem name="Christian Andrew O. Cas" />
            <DriverItem name="Kenly Emmanuel S. Custodio" />
          </View>

          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>ADD</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ✅ FULL SCREEN GOOGLE MAP MODAL */}
      <Modal
        visible={showMapModal}
        animationType="slide"
        onRequestClose={() => setShowMapModal(false)}
      >
        <SafeAreaView style={styles.mapModalContainer}>
          {/* Modal Header */}
          <View style={styles.mapModalHeader}>
            <Text style={styles.mapModalTitle}>{selectedShuttle} Route</Text>
            <TouchableOpacity
              style={styles.mapCloseButton}
              onPress={() => setShowMapModal(false)}
            >
              <Ionicons name="close-circle" size={32} color={COLORS.primaryBlue} />
            </TouchableOpacity>
          </View>

          {/* Full Screen Interactive Map */}
          <MapView
            style={styles.fullScreenMap}
            initialRegion={{
              latitude: 13.6218,
              longitude: 123.1948,
              latitudeDelta: 0.08,
              longitudeDelta: 0.06,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* ADNU Pacol (Destination) */}
            <Marker
              coordinate={{ latitude: 13.6218, longitude: 123.1948 }}
              title="ADNU Pacol"
              description="Destination"
            >
              <View style={styles.destinationMarker} />
            </Marker>

            {/* Rinconada (Shuttle A Start) */}
            <Marker
              coordinate={{ latitude: 13.65, longitude: 123.22 }}
              title="Rinconada"
              description="Shuttle A Start"
            />

            {/* Pili (Shuttle B Start) */}
            <Marker
              coordinate={{ latitude: 13.58, longitude: 123.28 }}
              title="Pili"
              description="Shuttle B Start"
            />
          </MapView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: COLORS.bgLight,
  },
  scrollContainer: {
    padding: 15,
  },
  headerSelector: {
    backgroundColor: COLORS.accentYellow,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#C0A040',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  shuttleCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shuttleContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  shuttleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  shuttleTitle: {
    color: COLORS.accentYellow,
    fontWeight: '900',
    fontSize: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.statusGreen,
    marginLeft: 8,
  },
  routeText: {
    color: 'white',
    fontSize: 11,
    marginBottom: 10,
    fontWeight: '500',
  },
  yellowPillButton: {
    backgroundColor: COLORS.accentYellow,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 6,
    alignSelf: 'flex-start',
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primaryBlue,
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeThumbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  mapPreview: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.accentYellow,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.accentYellow,
  },
  routeLabel: {
    color: COLORS.accentYellow,
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 4,
  },
  driversContainer: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 30,
    padding: 20,
    minHeight: 200,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  driversHeaderPill: {
    backgroundColor: COLORS.accentYellow,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  driversHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },
  driverList: {
    flex: 1,
  },
  driverRow: {
    backgroundColor: COLORS.accentYellow,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 15,
    marginBottom: 10,
    overflow: 'hidden',
  },
  driverName: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
    fontSize: 13,
    flex: 1,
  },
  manageButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    margin: 4,
  },
  manageText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: COLORS.accentYellow,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
  },

  // ✅ MAP MODAL STYLES
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mapModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: COLORS.bgLight,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mapModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryBlue,
    flex: 1,
  },
  mapCloseButton: {
    padding: 5,
    marginLeft: 10,
  },
  fullScreenMap: {
    flex: 1,
  },
  destinationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.accentYellow,
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
