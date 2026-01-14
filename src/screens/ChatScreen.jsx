import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';

import { ROUTES } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavourite } from '../redux/slice/appSettingsSlice';
import { Users } from 'lucide-react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import {
  SakuraHaruno,
  tanjiro,
  tarutoUzumaki,
} from '../assets/images/imagesListing';
export const lightColors = {
  background: '#F6F8FC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  secondaryText: '#6B7280',
  mutedText: '#9CA3AF',
  inputBg: '#FFFFFF',
  sectionBg: '#F8FAFC',
  chipBg: '#F3F4F6',
  chipBorder: '#E5E7EB',
  primary: '#3730A3',
  primaryBg: '#EEF2FF',
  primaryBorder: '#C7D2FE',
  bubbleMe: '#3730A3',
  bubbleMeText: '#FFFFFF',
  bubbleOther: '#F3F4F6',
  bubbleOtherText: '#111827',
  buttonBg: '#111827',
  buttonText: '#FFFFFF',
  star: '#FFD700',
};

export const darkColors = {
  background: '#0B1220',
  card: '#0F1A2E',
  border: '#22314D',
  text: '#EAF0FF',
  secondaryText: '#A9B6D3',
  mutedText: '#7F8EAC',
  inputBg: '#0F1A2E',
  sectionBg: '#0D172A',
  chipBg: '#14213A',
  chipBorder: '#22314D',
  primary: '#BFD0FF',
  primaryBg: '#1A2342',
  primaryBorder: '#2B3B6A',
  bubbleMe: '#2B3B6A',
  bubbleMeText: '#EAF0FF',
  bubbleOther: '#14213A',
  bubbleOtherText: '#EAF0FF',
  buttonBg: '#EAF0FF',
  buttonText: '#0B1220',
  star: '#FFD700',
};

const ChatScreen = ({ navigation, theme = 'light' }) => {
  const dispatch = useDispatch();

  const typing = useSelector(state => state.appSettings.userData.typing);
  const userId = useSelector(state => state.appSettings.userData.userId);
  const favourites = useSelector(state => state.appSettings.favourites);

  const colors = theme === 'dark' ? darkColors : lightColors;

  const styles = useMemo(() => makeStyles(colors), [colors]);

  const defaultChats = useMemo(
    () => [
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
    ],
    [],
  );

  const toggleFavorite = id => {
    dispatch(toggleFavourite(id));
  };

  const renderItem = ({ item }) => {
    const isFavorite = favourites.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        activeOpacity={0.85}
        onPress={() => navigation.navigate(ROUTES.CHAT, { chat: item })}
      >
        <Image source={item.avatar} style={styles.avatar} />

        <View style={styles.chatContent}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.message} numberOfLines={1}>
            {typing && userId === item.id ? 'typing…' : item.lastMessage}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleFavorite(item.id)}
          activeOpacity={0.85}
          style={styles.starBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name={isFavorite ? 'star' : 'star-o'}
            size={20}
            color={isFavorite ? colors.star : colors.secondaryText}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chats</Text>
          <Text style={styles.headerSub}>Your recent conversations</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate(ROUTES.ALLUSERS)}
          style={styles.headerIconBtn}
        >
          <Users color={colors.primary} size={22} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={defaultChats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ChatScreen;

const makeStyles = c =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      paddingTop: Platform.OS === 'android' ? 6 : 0,
    },

    header: {
      marginHorizontal: 14,
      marginBottom: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 16,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: '#000',
      shadowOpacity: c === darkColors ? 0.35 : 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
      marginTop: hp(8),
    },

    headerTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: c.text,
    },

    headerSub: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: '700',
      color: c.secondaryText,
    },

    headerIconBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: c.primaryBg,
      borderWidth: 1,
      borderColor: c.primaryBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },

    list: {
      paddingVertical: 6,
      paddingBottom: 22,
    },

    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 10,
      marginHorizontal: 14,
      backgroundColor: c.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: '#000',
      shadowOpacity: c === darkColors ? 0.28 : 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },

    avatar: {
      width: 56,
      height: 56,
      borderRadius: 16,
      marginRight: 12,
      borderWidth: 1,
      borderColor: c.primaryBorder,
      backgroundColor: c.primaryBg,
    },

    chatContent: {
      flex: 1,
      minWidth: 0,
    },

    name: {
      fontSize: 16,
      fontWeight: '900',
      color: c.text,
    },

    message: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: '700',
      color: c.secondaryText,
    },

    starBtn: {
      marginLeft: 10,
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: c.sectionBg,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
