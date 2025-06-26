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
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { toggleFavourite } from '../redux/slice/appSettingsSlice';
import { SakuraHaruno, tanjiro, tarutoUzumaki } from '../assets/images/imagesListing';

const CHAT_LIST_KEY = 'CHAT_LIST';

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
  const dispatch = useDispatch();
  const typing = useSelector(state => state.appSettings.userData.typing);
  const userId = useSelector(state => state.appSettings.userData.userId);
  const favourites = useSelector(state => state.appSettings.favourites);

  const [chats, setChats] = useState([]);

  const colors = theme === 'dark' ? darkColors : lightColors;

  const defaultChats = [
    {
      id: '1',
      name: 'Naruto Uzumaki',
      lastMessage: 'Believe it!',
      avatar: tarutoUzumaki,
    },
    {
      id: '2',
      name: 'Sakura Haruno',
      lastMessage: 'You’re so annoying!',
      avatar: SakuraHaruno,
    },
    {
      id: '3',
      name: 'Tanjiro Kamado',
      lastMessage: 'Sorry I’m late…',
      avatar: tanjiro,
    },
  ];

  

  const toggleFavorite = id => {
    dispatch(toggleFavourite(id));
  };

  const renderItem = ({ item }) => {
    const isFavorite = favourites.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.chatItem, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate(ROUTES.CHAT, { chat: item })}
      >
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.chatContent}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.message, { color: colors.secondaryText }]}>
            {typing && userId === item.id ? 'typing...' : item.lastMessage}
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
        </View>

      <FlatList
        data={defaultChats}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  list: {
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    marginHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#007AFF22',
  },
  chatContent: {
    flex: 1,
    marginLeft: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
