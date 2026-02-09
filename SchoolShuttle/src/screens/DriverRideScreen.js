import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function DriverRideScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Driver Ride Screen</Text>
      <View style={styles.content}>
        <Text>Map and Route Navigation will go here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E3A8A' 
  },
  content: {
    marginTop: 20,
  }
});
