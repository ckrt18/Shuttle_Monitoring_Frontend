import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image 
} from 'react-native';
// 1. Import Ionicons
import { Ionicons } from '@expo/vector-icons'; 

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // 2. State for toggling password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    const user = username.trim().toLowerCase();

    if (user === 'cham') {
        navigation.replace('StudentMain'); 
    } else if (user === 'marjorie') {
        navigation.replace('ParentMain');
    } else if (user === 'ben') {
        navigation.replace('DriverMain');
    } else if (user === 'oppie') {
        navigation.replace('OperatorMain');
    } else {
        Alert.alert("Login Failed", "User not found. Try 'cham' for Student or 'marjorie' for Parent.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* LOGO AREA */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
             <Image 
               source={require('../../assets/adnu logo.png')} 
               style={styles.logoImage} 
               resizeMode="cover" 
             />
          </View>
          <Text style={styles.appName}>Ride.ADNU</Text>
        </View>

        {/* INPUTS */}
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, {marginBottom: 0, flex: 1, elevation: 0}]} 
            placeholder="Password"
            placeholderTextColor="#666"
            // 3. Toggle secureTextEntry based on state
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          
          {/* 4. Updated Toggle Button with Ionicons */}
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
            <Ionicons 
              // Show 'eye-off' (slash) when visible, 'eye' when hidden
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCD34D', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoCircle: {
    width: 120, 
    height: 120,
    backgroundColor: 'white',
    borderRadius: 60, 
    marginBottom: 10,
    elevation: 5, 
    overflow: 'hidden', 
    borderWidth: 0,
  },
  logoImage: {
    width: '100%', 
    height: '100%',
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A', 
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 15,
    elevation: 2, 
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    paddingRight: 15, // Added padding for the icon
    marginBottom: 20,
    elevation: 2,
  },
  eyeIcon: {
    padding: 5, // Hit slop area for easier clicking
  },
  button: {
    backgroundColor: '#1E3A8A', 
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
});
