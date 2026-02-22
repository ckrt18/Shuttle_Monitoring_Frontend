import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function OperatorMessageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="chatbubbles-outline" size={60} color="#1E3A8A" />
      <Text style={styles.title}>System Broadcasts</Text>
      <Text style={styles.subtitle}>Chat with Drivers and Parents</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 10 }
});
