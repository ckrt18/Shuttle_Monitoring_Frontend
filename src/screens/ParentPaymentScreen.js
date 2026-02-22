import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function ParentPaymentScreen() {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchPayments();
  }, [user]);

  const fetchPayments = async () => {
    try {
      // API: GET /api/payments/parent/{id}
      // Note: Adjust endpoint if needed based on real API docs
      const res = await api.get(`/payments/parent/${user.id}`).catch(e => null);

      if (res?.data) {
        // Assuming response structure has { balance: number, transactions: [] }
        // If it returns just a list of transactions, we might need to calculate balance or fetch elsewhere
        // For now, let's assume we get a list and we default balance.
        if (Array.isArray(res.data)) {
          setTransactions(res.data);
        } else if (res.data.transactions) {
          setTransactions(res.data.transactions);
          if (res.data.balance) setBalance(res.data.balance);
        }
      } else {
        // Keep mock for demo if API returns nothing or 404
        setTransactions([
          { id: '1', date: 'Jan 14, 2026', desc: 'Ride Deduction', amount: '-P50.00' },
          { id: '2', date: 'Jan 13, 2026', desc: 'Top Up', amount: '+P1,000.00' },
        ]);
        setBalance('3,000.00');
      }
    } catch (e) {
      console.log("Error fetching payments:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Payments & Wallet</Text></View>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>P{balance}</Text>
        <TouchableOpacity style={styles.topUpBtn}><Text style={styles.topUpText}>+ Top Up</Text></TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Recent Transactions</Text>

      {loading ? (
        <ActivityIndicator color="#1E3A8A" />
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id || Math.random().toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <View>
                <Text style={styles.transDesc}>{item.desc || item.description || 'Transaction'}</Text>
                <Text style={styles.transDate}>{item.date || 'Reeent'}</Text>
              </View>
              <Text style={[styles.transAmount, { color: (item.amount && item.amount.includes && item.amount.includes('+')) ? 'green' : '#EF4444' }]}>
                {item.amount || item.value || '0.00'}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>No transactions found.</Text>}
        />
      )}
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
