import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import colors from '../constants/colors';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Animated.View
          entering={FadeInUp.springify().damping(15)}
          exiting={FadeOutUp}
          style={[
            styles.toastContainer,
            toast.type === 'error' && styles.toastError,
            toast.type === 'info' && styles.toastInfo,
          ]}
        >
          <Text style={styles.toastText}>{toast.message}</Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#000000',
    borderColor: colors.primary,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 9999,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  toastError: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
  },
  toastInfo: {
    borderColor: colors.secondary,
    shadowColor: colors.secondary,
  },
  toastText: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'Courier',
    fontWeight: '700',
    textAlign: 'center',
  },
});
