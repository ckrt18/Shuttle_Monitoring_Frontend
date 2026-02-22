import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function ParentProfileScreen({ navigation }) {
  const { logout, user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/parents/${user.id}`);
      setProfile(res.data);
    } catch (e) { console.log(e); }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out", style: 'destructive', onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}><Text style={{ fontSize: 50 }}>👩</Text></View>
        <Text style={styles.name}>{profile?.fullName || user?.username || 'Parent'}</Text>
        <Text style={styles.role}>{user?.role || 'Parent / Guardian'}</Text>
      </View>
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>My Account</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text style={styles.menuText}>Linked Students (1)</Text><Text style={styles.arrow}>›</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#1E3A8A', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A' },
  role: { fontSize: 16, color: '#666', marginTop: 5 },
  menu: { backgroundColor: 'white', borderRadius: 15, padding: 5, marginBottom: 30 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 18, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { fontSize: 16, color: '#333', fontWeight: '500' },
  arrow: { color: '#ccc', fontSize: 18, fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#FFEBEB', padding: 15, borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
});
