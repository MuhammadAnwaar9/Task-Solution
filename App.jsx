import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigation from './src/Navigation/MainNavigation';
import { ChatProvider } from './src/context/ChatContext';
import eventBus from './src/utils/eventBus';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { SafeAreaView, StatusBar } from 'react-native';
import { setTheme } from './src/redux/slice/appSettingsSlice';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const Stack = createNativeStackNavigator();

function RootStack() {
  const theme = useSelector(state => state.appSettings.theme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(next));
  };

  return (
    <ChatProvider>
      <MainNavigation theme={theme} toggleTheme={toggleTheme} />
    </ChatProvider>
  );
}

function AppContent() {
  const navRef = useNavigationContainerRef();
  const theme = useSelector(state => state.appSettings.theme);

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
    };

    eventBus.on('notify', handler);
    return () => eventBus.off('notify', handler);
  }, []);

  return (
    <>
      {/* <SafeAreaView style={{ flex: 1 }}> */}
        <NavigationContainer ref={navRef} theme={navTheme}>
          <RootStack />
        </NavigationContainer>
        <Toast />
      {/* </SafeAreaView> */}
    </>
  );
}

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <AppContent />
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
