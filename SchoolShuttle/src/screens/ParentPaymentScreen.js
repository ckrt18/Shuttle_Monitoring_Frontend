import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';

export default function ParentPaymentScreen() {
  const transactions = [
    { id: '1', date: 'Jan 14, 2026', desc: 'Ride Deduction', amount: '-P50.00' },
    { id: '2', date: 'Jan 13, 2026', desc: 'Top Up', amount: '+P1,000.00' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Payments & Wallet</Text></View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>P3,000.00</Text>
        <TouchableOpacity style={styles.topUpBtn}><Text style={styles.topUpText}>+ Top Up</Text></TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>
      <FlatList 
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.transactionItem}>
            <View><Text style={styles.transDesc}>{item.desc}</Text><Text style={styles.transDate}>{item.date}</Text></View>
            <Text style={[styles.transAmount, { color: item.amount.includes('+') ? 'green' : '#EF4444' }]}>{item.amount}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  header: { alignItems: 'center', marginVertical: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A' },
  balanceCard: { backgroundColor: '#1E3A8A', borderRadius: 20, padding: 30, alignItems: 'center', marginBottom: 30 },
  balanceLabel: { color: '#FCD34D', fontSize: 16 },
  balanceAmount: { color: 'white', fontSize: 40, fontWeight: 'bold', marginVertical: 10 },
  topUpBtn: { backgroundColor: '#FCD34D', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 25 },
  topUpText: { fontWeight: 'bold', color: '#1E3A8A' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 10 },
  transDesc: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  transDate: { color: '#999', fontSize: 12 },
  transAmount: { fontWeight: 'bold', fontSize: 16 },
});
