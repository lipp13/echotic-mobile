import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, focused && styles.focusedWrapper, error && styles.errorWrapper]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#52525b"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  focusedWrapper: {
    borderColor: colors.primary,
    backgroundColor: '#22222e',
  },
  errorWrapper: {
    borderColor: '#ff453a',
  },
  input: {
    color: '#ffffff',
    fontSize: 14,
    padding: 0,
  },
  errorText: {
    color: '#ff453a',
    fontSize: 11,
    marginTop: 6,
  },
});

export default Input;

