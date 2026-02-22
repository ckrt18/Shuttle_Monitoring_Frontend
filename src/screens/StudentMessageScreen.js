import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext'; // Need context if we want user details
import api from '../services/api'; // Real API

export default function StudentMessageScreen() {

  // =================================================================
  // 1. STATE MANAGEMENT
  // =================================================================
  const { user } = useContext(AuthContext);
  const [parentContact, setParentContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);


  // =================================================================
  // 2. EFFECT HOOKS & DATA FETCHING
  // =================================================================

  const pollInterval = useRef(null);

  useEffect(() => {
    fetchParentContact();
    return () => stopPolling();
  }, []);

  useEffect(() => {
    stopPolling();
    setMessages([]);

    if (parentContact) {
      fetchHistory(parentContact.id);
      startPolling(parentContact.id);
    }
  }, [parentContact]);

  const fetchParentContact = async () => {
    try {
      setLoading(true);
      let parent = null;

      // Strategy 1: /messages/contacts (returns User objects)
      try {
        const res = await api.get('/messages/contacts');
        if (res.data && Array.isArray(res.data)) {
          const parentUser = res.data.find(c => (c.role || '').toUpperCase().includes('PARENT'));
          if (parentUser) {
            parent = {
              id: parentUser.userId,
              username: parentUser.username,
              fullName: parentUser.username,
              role: 'PARENT'
            };
          }
        }
      } catch (e) { }

      // Strategy 2: GET /students/{id} for parent from student profile
      if (!parent) {
        try {
          const res = await api.get(`/students/${user.id}`);
          if (res.data?.parent) {
            const p = res.data.parent;
            const pUser = p.user;
            parent = {
              id: pUser ? pUser.userId : p.parentId,
              username: pUser ? pUser.username : 'Parent',
              fullName: p.fullName || (pUser ? pUser.username : 'Parent'),
              role: 'PARENT'
            };
          }
        } catch (e) { }
      }

      setParentContact(parent);
    } catch (error) {
      console.log('[Messages] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (receiverId) => {
    stopPolling();
    pollInterval.current = setInterval(() => {
      fetchHistory(receiverId, true);
    }, 3000);
  };

  const stopPolling = () => {
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  const fetchHistory = async (receiverId, isSilent = false) => {
    if (!receiverId) return;
    if (!isSilent) setLoading(true);

    try {
      const res = await api.get(`/messages/history/${receiverId}`);
      if (res.data) {
        const sorted = res.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(sorted); // Using simple setMessages for now, replacing 'conversations' logic
      }
    } catch (error) {
      console.log("Error fetching history:", error);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // Helper to format name
  const formatName = (contact) => {
    if (!contact) return 'Unknown';
    if (contact.fullName) return contact.fullName;
    if (contact.firstName && contact.lastName) return `${contact.firstName} ${contact.lastName}`;
    return contact.username || 'Unknown User';
  };


  // Generic function to add a message to state
  const addMessage = (newMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };


  // =================================================================
  // 3. IMAGE / CAMERA HANDLERS
  // =================================================================

  const handleCameraPress = () => {
    Alert.alert("Send a Photo", "Choose a source", [
      { text: "Open Camera", onPress: launchCamera },
      { text: "Open Gallery", onPress: launchLibrary },
      { text: "Cancel", style: "cancel" }
    ]);
  };

  const launchCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Needs camera access');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    sendImage(result);
  };

  const launchLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Needs gallery access');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    sendImage(result);
  };

  const sendImage = (result) => {
    if (!result.canceled) {
      const newPhotoMessage = {
        id: Date.now().toString() + Math.random(),
        type: 'image',
        uri: result.assets[0].uri,
        sender: 'user',
      };
      addMessage(newPhotoMessage);
    }
  };


  // =================================================================
  // 4. TEXT MESSAGE HANDLER
  // =================================================================

  const handleSend = async () => {
    if (inputText.trim().length === 0) return;
    if (!parentContact) {
      Alert.alert('Error', 'No parent assigned to message.');
      return;
    }

    const content = inputText;
    setInputText('');
    setSending(true);

    try {
      await api.post('/messages/send', {
        receiverId: parentContact.id,
        content: content
      });
      fetchHistory(parentContact.id, true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
      setInputText(content);
    } finally {
      setSending(false);
    }
  };


  // =================================================================
  // 5. RENDER HELPERS
  // =================================================================

  const renderMessageItem = ({ item }) => {
    // Backend Message entity: { sender: {userId, username}, receiver: {userId, username}, content, timestamp }
    const isUser = item.sender?.userId == user.id || item.sender?.username === user.username;
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.driverBubble]}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} style={styles.messageImage} />
        ) : (
          <Text style={[styles.messageText, isUser ? styles.userText : styles.driverText]}>
            {item.content || item.text}
          </Text>
        )}
      </View>
    );
  };

  const currentMessages = messages;
  const currentContact = parentContact;


  // =================================================================
  // 6. MAIN RENDER
  // =================================================================

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* PARENT CONTACT INDICATOR */}
      <View style={styles.tabContainer}>
        <View style={[styles.tab, styles.activeTab]}>
          <Ionicons name="chatbubbles" size={18} color="#1E3A8A" style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, styles.activeTabText]}>
            Chat with Parent
          </Text>
        </View>
      </View>

      {/* CHAT INTERFACE */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.chatWrapper}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.chatContainer}>

          {/* Contact Header */}
          <View style={styles.contactHeader}>
            <Text style={styles.contactName}>
              {currentContact ? formatName(currentContact) : 'No Parent Assigned'}
            </Text>
            {currentContact && (
              <Text style={{ fontSize: 10, color: '#1E3A8A' }}>Online</Text>
            )}
            {!currentContact && (
              <Text style={{ fontSize: 9, color: 'red', marginTop: 2 }}>
                (No parent linked in backend)
              </Text>
            )}
          </View>

          {/* Message List */}
          <View style={styles.messageArea}>
            {currentMessages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Start chatting with your Parent...</Text>
              </View>
            ) : (
              <FlatList
                ref={flatListRef}
                data={currentMessages}
                renderItem={renderMessageItem}
                keyExtractor={item => String(item.messageId || item.id || Math.random())}
                contentContainerStyle={{ padding: 10 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              />
            )}
          </View>

          {/* Input Bar */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleCameraPress}>
              <Ionicons name="camera" size={28} color="#1E3A8A" />
            </TouchableOpacity>

            <TextInput
              style={styles.inputField}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
            />

            <TouchableOpacity style={styles.iconButton} onPress={handleSend}>
              <Ionicons name="send" size={28} color="#1E3A8A" />
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


// =================================================================
// 7. STYLES
// =================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },

  // Header
  header: {
    backgroundColor: '#FCD34D',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A8A'
  },

  // Tab Bar
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: '#fff'
  },
  tab: {
    backgroundColor: '#FFEBA7',
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 25,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FFEBA7',
    flexDirection: 'row',
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: '#FCD34D',
    borderColor: '#1E3A8A',
    borderWidth: 2
  },
  tabText: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: 16
  },
  activeTabText: {
    color: '#1E3A8A'
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'red',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold'
  },

  // Main Chat Layout
  chatWrapper: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 120,
    marginVertical: 10
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f0eddf',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    justifyContent: 'space-between'
  },
  contactHeader: {
    backgroundColor: '#FCD34D',
    padding: 10,
    alignItems: 'center',
    margin: 12,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#1E3A8A'
  },
  contactName: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 20
  },
  messageArea: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyStateText: {
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic'
  },

  // Message Bubbles
  messageBubble: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '80%'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E3A8A',
    borderBottomRightRadius: 2
  },
  driverBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2
  },
  messageText: {
    fontSize: 15
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10
  },
  userText: {
    color: '#fff'
  },
  driverText: {
    color: '#333'
  },

  // Input Bar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0eddf',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingBottom: 15
  },
  inputField: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#1E3A8A',
    marginHorizontal: 10,
    color: '#333'
  },
  iconButton: {
    padding: 5
  },
});
