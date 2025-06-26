import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const NotificationBanner = ({ visible, chat, message, onPress }) => {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.title}>{chat?.name || 'Someone'}</Text>
        <Text style={styles.message}>{message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default NotificationBanner;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width,
    backgroundColor: '#007AFF',
    padding: 14,
    zIndex: 1000,
    elevation: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  title: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
  },
});
