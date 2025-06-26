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
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/slice/appSettingsSlice';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
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
  const typing = useSelector(state => state.appSettings.userData.typing);
  const scrollRef = useRef(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useDispatch();

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
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaultMessages),
          );
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    loadMessages();
  }, []);

  const saveMessages = async updatedMessages => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMessages));
    } catch (err) {
      console.error('Failed to save messages:', err);
    }
  };

  const handleSend = () => {
    dispatch(setUserData({ typing: true, userId: chat?.id }));

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

      dispatch(setUserData({ typing: false, userId: chat?.id }));
    }, 5000);
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
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Image source={chat?.avatar} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerText, { color: colors.text }]}>
            {chat.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: typing
                ? '#FF9500'
                : isOnline
                ? 'green'
                : colors.secondaryText,
              fontWeight: '500',
            }}
          >
            {typing ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <FlatList
        ref={scrollRef}
        data={messages}
        keyExtractor={item => item.id}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        renderItem={({ item, index }) => {
          const isMe = item.sender === 'me';
          return (
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor: isMe ? colors.bubbleMe : colors.bubbleOther,
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  marginBottom: index === messages.length - 1 ? 80 : 0,
                  borderTopLeftRadius: isMe ? 18 : 4,
                  borderTopRightRadius: isMe ? 4 : 18,
                },
              ]}
            >
              <Text style={{ color: isMe ? '#fff' : colors.text }}>
                {item.text}
              </Text>
            </View>
          );
        }}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
      />

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
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, { backgroundColor: colors.bubbleMe }]}
        >
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  chatList: {
    padding: 12,
    paddingBottom: 90,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 5,
    borderRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    borderTopWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -1 },
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#f1f1f1',
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    elevation: 2,
  },
  sendText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
