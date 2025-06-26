import { StyleSheet, Platform } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ROUTES } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ theme, toggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#1E1E1E' : '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 70,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarActiveTintColor: isDark ? '#FFD700' : '#007AFF',
        tabBarInactiveTintColor: isDark ? '#777' : '#999',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === ROUTES.CHATSCREEN) {
            iconName = 'wechat';
          } else if (route.name === ROUTES.PROFILES) {
            iconName = 'user-circle';
          }
          return <Icon name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name={ROUTES.CHATSCREEN}
        options={{ tabBarLabel: 'Chat' }}
      >
        {props => (
          <ChatScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>

      <Tab.Screen
        name={ROUTES.PROFILES}
        options={{ tabBarLabel: 'Profile' }}
      >
        {props => (
          <ProfileScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({});
