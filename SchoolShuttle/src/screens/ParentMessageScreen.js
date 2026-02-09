import React, { useState, useRef } from 'react'; 
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
  Image, 
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 

export default function ParentMessageScreen() {
  
  // =================================================================
  // 1. STATE MANAGEMENT
  // =================================================================
  const [activeTab, setActiveTab] = useState('Operator'); 
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // Store conversation history for all 3 roles
  const [conversations, setConversations] = useState({
    Operator: { 
      name: 'Al Francis Paz', 
      role: 'Operator',
      messages: [] 
    },
    Driver: { 
      name: 'Kuya Ben', 
      role: 'Driver',
      messages: [{ id: '1', text: 'Papunta na po.', sender: 'them', type: 'text' }]
    },
    Student: { 
      name: 'Cham', 
      role: 'Student',
      messages: []
    }
  });

  // Store unread notification badges
  const [unreadCounts, setUnreadCounts] = useState({
    Operator: 0,
    Driver: 0, 
    Student: 1
  });


  // =================================================================
  // 2. HELPER FUNCTIONS
  // =================================================================
  
  // Switch tabs and clear notifications for that tab
  const switchTab = (tabName) => {
    setActiveTab(tabName);
    setUnreadCounts((prev) => ({ ...prev, [tabName]: 0 }));
  };

  // Generic function to append a message
  const addMessage = (tab, newMessage) => {
    setConversations((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        messages: [...prev[tab].messages, newMessage]
      }
    }));
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
      addMessage(activeTab, newPhotoMessage);
    }
  };


  // =================================================================
  // 4. TEXT MESSAGE HANDLER
  // =================================================================

  const handleSend = () => {
    if (inputText.trim().length === 0) return; 
    
    const newMessage = { 
      id: Date.now().toString() + Math.random(), 
      type: 'text', 
      text: inputText, 
      sender: 'user' 
    };
    
    addMessage(activeTab, newMessage);
    setInputText(''); 
  };


  // =================================================================
  // 5. RENDER HELPERS
  // =================================================================

  const renderMessageItem = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.themBubble]}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.uri }} style={styles.messageImage} />
        ) : (
          <Text style={[styles.messageText, isUser ? styles.userText : styles.themText]}>
            {item.text}
          </Text>
        )}
      </View>
    );
  };

  const currentChat = conversations[activeTab];
  const currentMessages = currentChat.messages;


  // =================================================================
  // 6. MAIN RENDER
  // =================================================================

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Parent Messages</Text> 
      </View>

      {/* TAB NAVIGATION */}
      <View style={styles.tabContainer}>
        {['Operator', 'Driver', 'Student'].map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]} 
            onPress={() => switchTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
            {unreadCounts[tab] > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCounts[tab]}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* CHAT INTERFACE */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.chatWrapper} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.chatContainer}>
          
          {/* Contact Header (Yellow Pill) */}
          <View style={styles.contactHeader}>
            <Text style={styles.contactName}>
              {currentChat.role}: {currentChat.name}
            </Text>
          </View>
          
          {/* Message List */}
          <View style={styles.messageArea}>
            {currentMessages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Start chatting with {activeTab}...</Text>
              </View>
            ) : (
              <FlatList 
                ref={flatListRef} 
                data={currentMessages} 
                renderItem={renderMessageItem} 
                keyExtractor={item => item.id} 
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
              placeholder={`Message ${activeTab}...`} 
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
    paddingHorizontal: 20, 
    borderRadius: 25, 
    marginHorizontal: 5, 
    borderWidth: 1, 
    borderColor: '#FFEBA7' 
  },
  activeTab: { 
    backgroundColor: '#FCD34D', 
    borderColor: '#1E3A8A', 
    borderWidth: 2 
  },
  tabText: { 
    fontWeight: 'bold', 
    color: '#555', 
    fontSize: 14 
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
    fontSize: 18 
  },
  
  // Messages Area
  messageArea: { 
    flex: 1, 
    backgroundColor: 'transparent' 
  },
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

  // Chat Bubbles
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
  themBubble: { 
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
  themText: { 
    color: '#333' 
  },

  // Input Bar
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#f0eddf', 
    height: 80, // Matched to Student Screen
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
