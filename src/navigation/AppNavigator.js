import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// --- STUDENT SCREENS ---
import LoginScreen from '../screens/LoginScreen';
import StudentHomeScreen from '../screens/StudentHomeScreen';
import StudentRideScreen from '../screens/StudentRideScreen';
import StudentMessageScreen from '../screens/StudentMessageScreen';
import StudentProfileScreen from '../screens/StudentProfileScreen';

// --- PARENT SCREENS ---
import ParentHomeScreen from '../screens/ParentHomeScreen';
import ParentRideScreen from '../screens/ParentRideScreen';
import ParentPaymentScreen from '../screens/ParentPaymentScreen';
import ParentMessageScreen from '../screens/ParentMessageScreen';
import ParentProfileScreen from '../screens/ParentProfileScreen';

// --- DRIVER SCREENS ---
import DriverHomeScreen from '../screens/DriverHomeScreen';
import DriverRideScreen from '../screens/DriverRideScreen';
import DriverPassengerScreen from '../screens/DriverPassengerScreen';
import DriverMessageScreen from '../screens/DriverMessageScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';

// --- OPERATOR SCREENS (NEW) ---
import OperatorHomeScreen from '../screens/OperatorHomeScreen';
import OperatorRideScreen from '../screens/OperatorRideScreen';
import OperatorPaymentScreen from '../screens/OperatorPaymentScreen';
import OperatorMessageScreen from '../screens/OperatorMessageScreen';
import OperatorProfileScreen from '../screens/OperatorProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- SHARED TAB BAR OPTIONS ---
const tabBarOptions = ({ route }) => ({
  headerShown: false,
  tabBarStyle: {
    backgroundColor: '#1E3A8A',
    position: 'absolute', bottom: 25, width: '100%', alignSelf: 'center', left: '5%', right: '5%',
    elevation: 5, borderRadius: 35, height: 75, borderTopWidth: 0, paddingBottom: 10, paddingTop: 10,
  },
  tabBarLabelStyle: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  tabBarActiveTintColor: '#FFD700',
  tabBarInactiveTintColor: 'white',
  tabBarIcon: ({ focused }) => {
    let iconName;
    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
    else if (route.name === 'Ride') iconName = focused ? 'bus' : 'bus-outline';
    else if (route.name === 'Payments') iconName = focused ? 'wallet' : 'wallet-outline';
    else if (route.name === 'Messages') iconName = focused ? 'chatbubble' : 'chatbubble-outline';
    else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
    // Driver Specific Icons
    else if (route.name === 'Passengers') iconName = focused ? 'people' : 'people-outline';

    if (focused) {
      return (
        <View style={styles.activeIconContainer}>
          <Ionicons name={iconName} size={24} color="#1E3A8A" />
        </View>
      );
    }
    return <Ionicons name={iconName} size={24} color="white" />;
  },
});

// --- 1. STUDENT TABS ---
function StudentTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Ride" component={StudentRideScreen} />
      <Tab.Screen name="Messages" component={StudentMessageScreen} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 2. PARENT TABS ---
function ParentTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="Home" component={ParentHomeScreen} />
      <Tab.Screen name="Ride" component={ParentRideScreen} />
      <Tab.Screen name="Payments" component={ParentPaymentScreen} />
      <Tab.Screen name="Messages" component={ParentMessageScreen} />
      <Tab.Screen name="Profile" component={ParentProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 3. DRIVER TABS ---
function DriverTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="Home" component={DriverHomeScreen} />
      <Tab.Screen name="Ride" component={DriverRideScreen} />
      <Tab.Screen name="Passengers" component={DriverPassengerScreen} />
      <Tab.Screen name="Messages" component={DriverMessageScreen} />
      <Tab.Screen name="Profile" component={DriverProfileScreen} />
    </Tab.Navigator>
  );
}

// --- 4. OPERATOR TABS (NEW) ---
function OperatorTabs() {
  return (
    <Tab.Navigator screenOptions={tabBarOptions}>
      <Tab.Screen name="Home" component={OperatorHomeScreen} />
      <Tab.Screen name="Ride" component={OperatorRideScreen} />
      <Tab.Screen name="Payments" component={OperatorPaymentScreen} />
      <Tab.Screen name="Messages" component={OperatorMessageScreen} />
      <Tab.Screen name="Profile" component={OperatorProfileScreen} />
    </Tab.Navigator>
  );
}

import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';

export default function AppNavigator() {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    // You might want a Splash Screen here
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E3A8A' }}>
        <Ionicons name="bus" size={64} color="#FFD700" />
      </View>
    );
  }

  const role = (user?.role || '').toUpperCase();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // User is NOT logged in: Show Login
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          // User IS logged in: Show appropriate stack
          <>
            {role === 'STUDENT' && <Stack.Screen name="StudentMain" component={StudentTabs} />}
            {role === 'PARENT' && <Stack.Screen name="ParentMain" component={ParentTabs} />}
            {role === 'DRIVER' && <Stack.Screen name="DriverMain" component={DriverTabs} />}
            {role === 'OPERATOR' && <Stack.Screen name="OperatorMain" component={OperatorTabs} />}

            {/* Fallback: If role is unknown or missing, default to Student to prevent plain blank screen */}
            {role !== 'STUDENT' && role !== 'PARENT' && role !== 'DRIVER' && role !== 'OPERATOR' && (
              <Stack.Screen name="FallbackStudent" component={StudentTabs} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: '#FCD34D',
    padding: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
