import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function DriverProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Driver Profile</Text>
      <Text style={styles.name}>Kuya Ben</Text>
      <Text>ID: DRV-001</Text>
      
      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={{color:'white', fontWeight:'bold'}}>Log Out</Text>
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
