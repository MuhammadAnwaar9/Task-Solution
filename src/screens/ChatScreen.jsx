import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ROUTES } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {  useSelector } from 'react-redux';

const CHAT_LIST_KEY = 'CHAT_LIST';
const FAVORITE_CHAT_IDS_KEY = 'FAVORITE_CHAT_IDS';

const lightColors = {
  background: '#F9F9F9',
  card: '#FFFFFF',
  text: '#111',
  secondaryText: '#555',
  bubbleMe: '#007AFF',
  bubbleOther: '#E5E5EA',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  secondaryText: '#AAA',
  bubbleMe: '#4A90E2',
  bubbleOther: '#333',
};

const ChatScreen = ({ navigation, theme, toggleTheme }) => {
   const typing = useSelector(state => state.appSettings.userData.typing);
  const userId = useSelector(state => state.appSettings.userData.userId);


  
  const [chats, setChats] = useState([]);
  const [favorites, setFavorites] = useState([]);
  
  const colors = theme === 'dark' ? darkColors : lightColors;

  const defaultChats = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey there!',
      avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Let’s catch up tomorrow.',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
    },
    {
      id: '3',
      name: 'Ali Raza',
      lastMessage: 'Okay, I’ll send it.',
      avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    },
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const chatData = await AsyncStorage.getItem(CHAT_LIST_KEY);
        const favoriteData = await AsyncStorage.getItem(FAVORITE_CHAT_IDS_KEY);

        if (chatData) {
          setChats(JSON.parse(chatData));
        } else {
          setChats(defaultChats);
          await AsyncStorage.setItem(
            CHAT_LIST_KEY,
            JSON.stringify(defaultChats),
          );
        }

        if (favoriteData) {
          setFavorites(JSON.parse(favoriteData));
        }
      } catch (err) {
        console.error('Error loading chat or favorites:', err);
      }
    };

    loadData();
  }, []);

  const toggleFavorite = async id => {
    try {
      let updated = [...favorites];
      if (updated.includes(id)) {
        updated = updated.filter(favId => favId !== id);
      } else {
        updated.push(id);
      }

      setFavorites(updated);
      await AsyncStorage.setItem(
        FAVORITE_CHAT_IDS_KEY,
        JSON.stringify(updated),
      );
    } catch (err) {
      console.error('Failed to update favorites:', err);
    }
  };

  const renderItem = ({ item }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate(ROUTES.CHAT, { chat: item })}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.chatContent}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.message, { color: colors.secondaryText }]}>
            {typing&&userId===item?.id ? 'typing...' : item.lastMessage}
          </Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Icon
            name={isFavorite ? 'star' : 'star-o'}
            size={22}
            color={isFavorite ? '#FFD700' : colors.secondaryText}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Chats</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={[styles.themeToggle, { color: colors.text }]}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  themeToggle: {
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
    borderRadius: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    marginTop: 4,
  },
});
