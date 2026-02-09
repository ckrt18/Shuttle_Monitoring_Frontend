import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function OperatorProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={50} color="white" />
      </View>
      
      <Text style={styles.title}>Operator Profile</Text>
      <Text style={styles.name}>Admin User</Text>
      <Text style={styles.role}>Role: System Administrator</Text>
      
      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 16, fontWeight: '600', color: '#888', marginBottom: 5 },
  name: { fontSize: 28, fontWeight: 'bold', color: '#1E3A8A', marginBottom: 5 },
  role: { fontSize: 16, color: '#444', marginBottom: 40 },
  logoutBtn: { backgroundColor: '#EF4444', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 12, elevation: 3 },
  logoutText: { color:'white', fontWeight:'bold', fontSize: 16 }
});
