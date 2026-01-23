import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * NotificationBanner Component
 * Displays in-app notifications at the top of the screen with auto-dismiss
 * @param {string} message - The notification message
 * @param {string} type - 'success', 'error', 'info' (default: 'success')
 * @param {number} duration - Duration to show notification in ms (default: 3000)
 * @param {Function} onDismiss - Callback when notification is dismissed
 * @param {string} productTitle - Product title for new product notifications
 * @param {string} productPrice - Product price for new product notifications
 */
const NotificationBanner = ({
  message,
  type = 'success',
  duration = 3000,
  onDismiss,
  productTitle,
  productPrice,
}) => {
  const [visible, setVisible] = useState(!!message);
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    if (message) {
      setVisible(true);
      // Slide in animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleDismiss = () => {
    // Slide out animation
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      onDismiss && onDismiss();
    });
  };

  if (!visible) return null;

  const colors = {
    success: '#10B981',
    error: '#EF4444',
    info: '#3B82F6',
  };

  const icons = {
    success: 'checkmark-circle',
    error: 'close-circle',
    info: 'information-circle',
  };

  const backgroundColor = colors[type] || colors.success;
  const iconName = icons[type] || icons.success;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name={iconName} size={24} color="white" />
        <View style={styles.textContainer}>
          {productTitle ? (
            <>
              <Text style={styles.title}>{message}</Text>
              <Text style={styles.subtitle}>
                {productTitle} - ₹{productPrice}
              </Text>
            </>
          ) : (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
        <Ionicons name="close" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 1000,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    marginTop: 4,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
});

export default NotificationBanner;
