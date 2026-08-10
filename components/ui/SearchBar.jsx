import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

export function SearchBar({ value, onChangeText, onClear, placeholder = 'Search artists, venues, concerts...' }) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8e8e93"
        style={styles.input}
      />
      {value ? (
        <Pressable onPress={onClear} style={styles.clearBtn}>
          <View style={styles.clearBadge}>
            <Text style={styles.clearText}>✕</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    padding: 0,
  },
  clearBtn: {
    padding: 2,
  },
  clearBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default SearchBar;

