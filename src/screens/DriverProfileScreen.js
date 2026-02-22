import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

import { AuthContext } from '../context/AuthContext';

export default function DriverProfileScreen({ navigation }) {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>

      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', marginBottom: 10 }} />
        <Text style={styles.name}>{user?.fullName || user?.username || 'Driver'}</Text>
        <Text style={{ color: '#666' }}>ID: {user?.id}</Text>
        <Text style={{ color: '#666' }}>Role: {user?.role || 'DRIVER'}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  logoutBtn: { marginTop: 20, backgroundColor: '#EF4444', padding: 15, borderRadius: 10, width: 200, alignItems: 'center' }
});
