import React from 'react';
import { Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import colors from '../../constants/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  children,
  onPress,
  variant = 'primary', // primary | secondary | pink | outline
  size = 'md', // sm | md | lg
  disabled = false,
  loading = false,
  style,
  textStyle,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.96, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: 'rgba(255, 255, 255, 0.1)', border: 'rgba(255, 255, 255, 0.15)', text: '#ffffff' };
      case 'pink':
      case 'accent':
        return { bg: colors.primary, border: colors.primary, text: '#ffffff' };
      case 'outline':
        return { bg: 'transparent', border: 'rgba(255, 255, 255, 0.2)', text: '#ffffff' };
      case 'primary':
      default:
        return { bg: colors.primary, border: colors.primary, text: '#ffffff' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16, fontSize: 12, borderRadius: 20 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32, fontSize: 16, borderRadius: 28 };
      case 'md':
      default:
        return { paddingVertical: 12, paddingHorizontal: 24, fontSize: 14, borderRadius: 24 };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  const isTextLike =
    typeof children === 'string' ||
    typeof children === 'number' ||
    Array.isArray(children);

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: vStyles.bg,
          borderColor: vStyles.border,
          borderRadius: sStyles.borderRadius,
          paddingVertical: sStyles.paddingVertical,
          paddingHorizontal: sStyles.paddingHorizontal,
        },
        (disabled || loading) && styles.disabled,
        animatedStyle,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={vStyles.text} size="small" />
      ) : isTextLike ? (
        <Text style={[styles.text, { color: vStyles.text, fontSize: sStyles.fontSize }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default Button;

