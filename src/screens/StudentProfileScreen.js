import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, Modal, FlatList, ActivityIndicator, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function StudentProfileScreen({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [rideHistory, setRideHistory] = useState([]);

  // Debug State
  // const [debugLog, setDebugLog] = useState([]);
  // const addLog = (msg) => setDebugLog(prev => [...prev, msg]);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // 1. Try /students endpoint first (Detailed profile)
      let res = null;
      try {
        res = await api.get(`/students/${user.id}`);
      } catch (e) {
        // console.log("Student profile not found, checking generic user...");
      }

      // 2. Fallback to /users endpoint (Basic info)
      if (!res || !res.data) {
        try {
          res = await api.get(`/users/${user.id}`);
        } catch (e) {
          console.log("User fetch failed", e);
        }
      }

      if (res && res.data) {
        setProfile(res.data);
      }
    } catch (error) {
      console.log("Error fetching profile", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!'); return; }
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 1 });
    if (!result.canceled) { setProfileImage(result.assets[0].uri); }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out", style: 'destructive', onPress: () => {
          logout();
        }
      }
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </SafeAreaView>
    );
  }

  // Derived Display Values
  const displayName = profile?.fullName || profile?.username || user?.username || 'Student';
  const displayEmail = profile?.email || user?.email || 'N/A';
  const displayRole = profile?.section ? `Section: ${profile.section}` : 'Student Passenger';
  const displayId = profile?.studentId || profile?.userId ? `ID: ${profile.studentId || profile.userId}` : '';
  const displayContact = profile?.contactNumber || 'N/A';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleEditPhoto} style={styles.avatarContainer}>
            {profileImage || profile?.profilePicturePath ? (
              <Image source={{ uri: profileImage || profile?.profilePicturePath }} style={styles.avatarImage} />
            ) : (
              <Text style={{ fontSize: 50 }}>👤</Text>
            )}
            <View style={styles.editIconBadge}><Text style={{ fontSize: 12 }}>📷</Text></View>
          </TouchableOpacity>

          {/* REAL DATA DISPLAY */}
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>{displayRole}</Text>
          {displayId ? <Text style={styles.subDetail}>{displayId}</Text> : null}
        </View>

        <View style={styles.menu}>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Email</Text>
            <Text style={styles.menuValue}>{displayEmail}</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuText}>Contact</Text>
            <Text style={styles.menuValue}>{displayContact}</Text>
          </View>
          <TouchableOpacity style={styles.menuItem} onPress={() => setShowHistory(true)}>
            <Text style={styles.menuText}>My Ride History</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={showHistory} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowHistory(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ride History</Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}><Text style={styles.closeBtn}>Close</Text></TouchableOpacity>
          </View>
          <View style={styles.historyContent}>
            {rideHistory.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🚍</Text>
                <Text style={styles.emptyText}>No ride records found yet.</Text>
                <Text style={styles.emptySubText}>Your completed trips will appear here.</Text>
              </View>
            ) : (
              <FlatList data={rideHistory} keyExtractor={(item) => item.id} renderItem={({ item }) => (<View style={styles.historyItem}><Text>{item.date}</Text></View>)} />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { alignItems: 'center', marginBottom: 30, marginTop: 20 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#1E3A8A', marginBottom: 15, position: 'relative', overflow: 'visible' },
  avatarImage: { width: '100%', height: '100%', borderRadius: 60 },
  editIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#FCD34D', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center' },
  role: { fontSize: 16, color: '#666', marginTop: 5, fontWeight: '500' },
  subDetail: { fontSize: 14, color: '#999', marginTop: 2 },
  menu: { backgroundColor: 'white', borderRadius: 15, padding: 5, marginBottom: 30 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center' },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  menuValue: { fontSize: 16, color: '#666' },
  arrow: { color: '#ccc', fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#FFEBEB', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
  modalContainer: { flex: 1, backgroundColor: '#fff', padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#1E3A8A' },
  closeBtn: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
  historyContent: { flex: 1, paddingTop: 50 },
  emptyState: { alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 10 },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 5 },
});
