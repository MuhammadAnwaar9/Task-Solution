import { StyleSheet } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from '../screens/Chat';
import { ROUTES } from '../constants';
import BottomNavigation from './BottomNavigation';

const Stack = createNativeStackNavigator();

const MainNavigation = ({ theme, toggleTheme }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BottomNavigation" options={{ headerShown: false }}>
        {props => (
          <BottomNavigation
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name={ROUTES.CHAT} options={{ headerShown: false }}>
        {props => <Chat {...props} theme={theme} toggleTheme={toggleTheme} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MainNavigation;

const styles = StyleSheet.create({});
