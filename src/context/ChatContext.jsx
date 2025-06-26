// src/context/ChatContext.js
import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatContext = createContext();

const initialState = {
  chats: [],
  userSettings: {
    darkMode: false,
    notificationsEnabled: true,
  },
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_INITIAL':
      return {
        ...state,
        chats: action.payload.chats,
        userSettings: action.payload.userSettings,
        loading: false,
      };

    case 'TOGGLE_FAVORITE':
      const updatedChats = state.chats.map(chat =>
        chat.id === action.payload
          ? { ...chat, favorite: !chat.favorite }
          : chat
      );
      saveToStorage({ ...state, chats: updatedChats });
      return { ...state, chats: updatedChats };

    case 'UPDATE_SETTING':
      const updatedSettings = {
        ...state.userSettings,
        [action.payload.key]: action.payload.value,
      };
      saveToStorage({ ...state, userSettings: updatedSettings });
      return { ...state, userSettings: updatedSettings };

    default:
      return state;
  }
};

// Persist state to AsyncStorage
const saveToStorage = async (state) => {
  try {
    await AsyncStorage.setItem('appData', JSON.stringify(state));
  } catch (err) {
    console.error('Error saving data', err);
  }
};

// Load state from AsyncStorage or fallback to mock
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('appData');
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({
            type: 'LOAD_INITIAL',
            payload: {
              chats: parsed.chats || [],
              userSettings: parsed.userSettings || initialState.userSettings,
            },
          });
        } else {
          // fallback mock data
          const mockChats = [
            {
              id: '1',
              name: 'John Doe',
              lastMessage: 'Hey!',
              time: '2:30 PM',
              avatar: 'https://i.pravatar.cc/150?img=1',
              favorite: false,
            },
          ];
          const mockSettings = initialState.userSettings;
          dispatch({
            type: 'LOAD_INITIAL',
            payload: { chats: mockChats, userSettings: mockSettings },
          });
          await AsyncStorage.setItem(
            'appData',
            JSON.stringify({ chats: mockChats, userSettings: mockSettings })
          );
        }
      } catch (err) {
        console.error('Error loading app data', err);
      }
    };
    loadData();
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
