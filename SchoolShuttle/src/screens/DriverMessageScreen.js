import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function DriverMessageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Driver Messages</Text>
      <View style={styles.content}>
        <Text>Chat with Operator or Parents will appear here.</Text>
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
