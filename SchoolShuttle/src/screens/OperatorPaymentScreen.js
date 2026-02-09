import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

// --- MOCK DATA ---
const transactions = [
    { id: '1', student: 'Juan Cruz', amount: 'P500.00', date: 'Today, 10:00 AM', type: 'Load' },
    { id: '2', student: 'Maria Santos', amount: '-P20.00', date: 'Today, 9:30 AM', type: 'Ride' },
    { id: '3', student: 'Pedro Penduko', amount: '-P20.00', date: 'Today, 9:15 AM', type: 'Ride' },
    { id: '4', student: 'Ana Reyes', amount: 'P1000.00', date: 'Yesterday', type: 'Load' },
];

export default function OperatorPaymentScreen() {

  // Function to render each row
  const renderTransactionItem = ({ item }) => {
    const isLoad = item.type === 'Load';
    return (
        <View style={styles.row}>
            <View>
                <Text style={styles.studentName}>{item.student}</Text>
                <Text style={styles.dateText}>{item.type} • {item.date}</Text>
            </View>
            <Text style={[styles.amountText, { color: isLoad ? '#059669' : '#DC2626' }]}>
                {item.amount}
            </Text>
        </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Financial Logs</Text>
      
      {/* Total Summary Card */}
      <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Collections Today</Text>
          <Text style={styles.summaryValue}>P 15,420.00</Text>
      </View>

      {/* Transaction List */}
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', marginTop: 30, marginBottom: 20 },
  
  summaryCard: { backgroundColor: '#1E3A8A', padding: 25, borderRadius: 20, marginBottom: 20, elevation: 4 },
  summaryLabel: { color: '#FCD34D', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  summaryValue: { color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  
  listContent: { paddingBottom: 100 },
  
  row: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'white', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 1 
  },
  studentName: { fontWeight: 'bold', fontSize: 16, color: '#333' },
  dateText: { color: '#888', fontSize: 12, marginTop: 2 },
  amountText: { fontWeight: 'bold', fontSize: 16 }
});
