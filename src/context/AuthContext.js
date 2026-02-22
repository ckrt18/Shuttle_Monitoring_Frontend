import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const userData = await SecureStore.getItemAsync('userData');

      if (token && userData) {
        setUser(JSON.parse(userData));
        // Verify token validity by calling a protected endpoint if needed
      }
    } catch (e) {
      console.log('Error checking login:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/sign-in', {
        usernameOrEmail: username,
        password: password,
      });

      console.log('FULL LOGIN RESPONSE:', JSON.stringify(response.data, null, 2));

      if (response.data.status === 'success' || response.data.access_token) {
        const { access_token, user_id, username: apiUsername, role, roles } = response.data;

        let finalId = user_id;
        let finalRole = null;

        // Store token first to allow authenticated calls
        await SecureStore.setItemAsync('userToken', access_token);

        // ---------------------------------------------------------
        // STRATEGY 1: Check Direct Response
        // ---------------------------------------------------------
        if (role) finalRole = role;
        else if (roles && Array.isArray(roles) && roles.length > 0) finalRole = roles[0];
        else if (response.data.user_role) finalRole = response.data.user_role;

        // ---------------------------------------------------------
        // STRATEGY 2: Decode JWT (if role/id missing)
        // ---------------------------------------------------------
        if (!finalRole || !finalId) {
          try {
            const base64Url = access_token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            const decoded = JSON.parse(jsonPayload);
            console.log("Decoded JWT:", decoded);

            if (!finalRole) finalRole = decoded.role || decoded.roles || decoded.authorities;
            if (Array.isArray(finalRole)) finalRole = finalRole[0];

            if (!finalId) finalId = decoded.user_id || decoded.id || decoded.sub;
          } catch (e) {
            console.log("Error decoding JWT:", e);
          }
        }

        // ---------------------------------------------------------
        // STRATEGY 3: Fetch User Profile (The "Official" Way)
        // ---------------------------------------------------------
        if ((!finalRole || finalRole === 'STUDENT') && finalId) {
          try {
            console.log(`Fetching profile for user ${finalId}...`);
            const userRes = await api.get(`/users/${finalId}`);
            console.log("User Profile Data:", JSON.stringify(userRes.data));

            if (userRes.data?.role) {
              finalRole = userRes.data.role;
              console.log("Found Role in User Profile:", finalRole);
            } else if (userRes.data?.user?.role) {
              finalRole = userRes.data.user.role;
            }
          } catch (err) {
            console.log("Error fetching user profile:", err);
          }
        }

        // ---------------------------------------------------------
        // STRATEGY 4: Probe Role APIs (The "Brute Force" Way)
        // ---------------------------------------------------------
        // If we still think it's STUDENT (or null), but maybe they are a parent?
        if ((!finalRole || finalRole === 'STUDENT') && finalId) {
          try {
            const parentRes = await api.get(`/parents/${finalId}`).catch(() => null);
            if (parentRes?.data) {
              finalRole = 'PARENT';
              console.log("Identified as PARENT via probe");
            } else {
              const driverRes = await api.get(`/drivers/${finalId}`).catch(() => null);
              if (driverRes?.data) {
                finalRole = 'DRIVER';
                console.log("Identified as DRIVER via probe");
              } else {
                const opRes = await api.get(`/operators/${finalId}`).catch(() => null);
                if (opRes?.data) {
                  finalRole = 'OPERATOR';
                  console.log("Identified as OPERATOR via probe");
                }
              }
            }
          } catch (e) { }
        }

        // ---------------------------------------------------------
        // STRATEGY 5: Username Hardcode & Heuristics (The "Fail Safe")
        // ---------------------------------------------------------
        if (apiUsername === 'vicsotto') finalRole = 'PARENT';

        // HEURISTIC: If username contains 'driver', assume DRIVER
        if (apiUsername?.toLowerCase().includes('driver')) {
          console.log("Username contains 'driver', forcing role to DRIVER");
          finalRole = 'DRIVER';
        }
        // HEURISTIC: If username contains 'operator', assume OPERATOR
        if (apiUsername?.toLowerCase().includes('operator') || apiUsername?.toLowerCase().includes('admin')) {
          console.log("Username contains 'operator'/'admin', forcing role to OPERATOR");
          finalRole = 'OPERATOR';
        }

        // CLEANUP: Remove 'ROLE_' prefix if present (Spring Security standard)
        if (finalRole && finalRole.startsWith('ROLE_')) {
          finalRole = finalRole.replace('ROLE_', '');
        }

        // Final Default
        if (!finalRole) finalRole = 'STUDENT';

        // Normalize to Uppercase for consistency
        finalRole = finalRole.toUpperCase();

        console.log("✅ Final Resolved Role:", finalRole);

        const userObj = {
          id: finalId,
          username: apiUsername,
          role: finalRole,
        };

        await SecureStore.setItemAsync('userData', JSON.stringify(userObj));
        setUser(userObj);
        return userObj;
      } else {
        Alert.alert('Login Failed', 'Invalid response from server.');
        return false;
      }

    } catch (error) {
      console.log('Login Error:', error);
      const msg = error.response?.data?.message || 'Invalid Request';
      Alert.alert('Login Failed', msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      setUser(null);
    } catch (e) {
      console.log('Logout Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
