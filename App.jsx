import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigation from './src/Navigation/MainNavigation';
import { ChatProvider } from './src/context/ChatContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import eventBus from './src/utils/eventBus';
import { ROUTES } from './src/constants';
import { Animated, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';

const Stack = createNativeStackNavigator();
const THEME_KEY = 'APP_THEME';

function RootStack({ theme, toggleTheme }) {
  const theme = useSelector(state => state.appSettings.theme);

  return (
    <ChatProvider>
      <MainNavigation theme={theme} toggleTheme={toggleTheme} />
    </ChatProvider>
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const navRef = useNavigationContainerRef();
  const [notif, setNotif] = useState({
    visible: false,
    message: '',
    sender: '',
    chat: null,
  });

  useEffect(() => {
    const storedTheme = async () => {
      const value = await AsyncStorage.getItem(THEME_KEY);
      if (value) setTheme(value);
    };
    storedTheme();
  }, []);

  const toggleTheme = async () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    await AsyncStorage.setItem(THEME_KEY, next);
  };

  const navTheme = theme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    const handler = ({ message, sender, chat }) => {
      Toast.show({
        type: 'success',
        text1: `From ${sender}`,
        text2: message,
        position: 'top',
      });
      console.log('Received event:', message);
      setNotif({ visible: true, message, sender, chat });
    };

    eventBus.on('notify', handler);
    return () => eventBus.off('notify', handler);
  }, []);

  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <NavigationContainer ref={navRef} theme={navTheme}>
            <RootStack theme={theme} toggleTheme={toggleTheme} />
          </NavigationContainer>
        </PersistGate>
      </Provider>
      <Toast></Toast>
    </>
  );
}
