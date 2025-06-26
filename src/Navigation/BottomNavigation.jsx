import { StyleSheet } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatScreen';
import { ROUTES } from '../constants';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ theme, toggleTheme }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff',
        },
        tabBarActiveTintColor: theme === 'dark' ? '#4A90E2' : '#007AFF',
        tabBarInactiveTintColor: theme === 'dark' ? '#999' : '#888',
      }}
    >
      <Tab.Screen
        name={ROUTES.CHATSCREEN}
      >
        {(props) => (
          <ChatScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTES.PROFILES}
      >
        {(props) => (
          <ProfileScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({});
