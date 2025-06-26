import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import eventBus from '../utils/eventBus';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const lightColors = {
  background: '#F2F2F2',
  card: '#fff',
  text: '#111',
  secondaryText: '#555',
  bubbleMe: '#007AFF',
  bubbleOther: '#E5E5EA',
  inputBg: '#f1f1f1',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#fff',
  secondaryText: '#aaa',
  bubbleMe: '#4A90E2',
  bubbleOther: '#333',
  inputBg: '#1c1c1c',
};

const Chat = ({ route, theme, toggleTheme }) => {
  const { chat } = route.params;
  const scrollRef = useRef(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const colors = theme === 'dark' ? darkColors : lightColors;
  const STORAGE_KEY = `CHAT_MESSAGES_${chat.id}`;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setMessages(JSON.parse(stored));
        } else {
          const defaultMessages = [
            { id: '1', text: 'Hello!', sender: 'other' },
            { id: '2', text: 'Hi! How are you?', sender: 'me' },
          ];
          setMessages(defaultMessages);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultMessages));
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
  }, []);

  const saveMessages = async (updatedMessages) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    } catch (err) {
      console.error('Failed to save messages:', err);
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'me',
    };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    setInput('');

    setIsTyping(true);

    setTimeout(() => {
      const fakeReply = {
        id: Date.now().toString(),
        text: 'Got your message!',
        sender: 'other',
      };

      const newData = [...updatedMessages, fakeReply];
      setMessages(newData);
      saveMessages(newData);

      eventBus.emit('notify', {
        sender: chat.name,
        message: fakeReply.text,
        chat,
      });

      setIsTyping(false);
    }, 2000);
  };

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerText, { color: colors.text }]}>{chat.name}</Text>
          <Text style={{ fontSize: 12, color: isOnline ? 'green' : colors.secondaryText }}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={{ color: colors.bubbleMe, marginLeft: 12 }}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={scrollRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item,index }) => {
          const isMe = item.sender === 'me';
          return (
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: isMe ? colors.bubbleMe : colors.bubbleOther,
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  marginBottom:index===messages.length-1&&70,
                  
                },
              ]}
            >
              <Text style={{ color: isMe ? '#fff' : colors.text }}>{item.text}</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing Indicator */}
      {isTyping && (
        <Text style={[styles.typingText, { color: colors.secondaryText }]}>
          {chat.name} is typing...
        </Text>
      )}

      {/* Input */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor={colors.secondaryText}
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.text,
            },
          ]}
        />
        <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: colors.bubbleMe }]}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
  },
  chatList: {
    padding: 12,
    paddingBottom: 80,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    marginVertical: 6,
    borderRadius: 18,
  },
  typingText: {
    fontStyle: 'italic',
    marginLeft: 14,
    marginBottom: 4,
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 0.5,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
  },
});
