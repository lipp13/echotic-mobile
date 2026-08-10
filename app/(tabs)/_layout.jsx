import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

function TabBarIcon({ title, focused }) {
  const getIconSymbol = () => {
    switch (title) {
      case 'HOME':
        return '🏠';
      case 'DISCOVER':
        return '🔍';
      case 'TICKETS':
        return '🎫';
      case 'PROFILE':
        return '👤';
      default:
        return '⚡';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={styles.iconText}>{getIconSymbol()}</Text>
      <Text style={[styles.label, focused && styles.focusedLabel]}>{title}</Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon title="HOME" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon title="DISCOVER" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon title="TICKETS" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabBarIcon title="PROFILE" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconText: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    color: '#8e8e93',
    fontSize: 10,
    fontWeight: '500',
  },
  focusedLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});

