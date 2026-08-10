import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProviders } from '../providers/AppProviders';
import colors from '../constants/colors';
import '../global.css';

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="concert/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="checkout/index" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="payment/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="payment/success" options={{ animation: 'fade' }} />
        <Stack.Screen name="ticket/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="search" options={{ animation: 'fade' }} />
        <Stack.Screen name="favorites" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="transaction-history" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="edit-profile" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </AppProviders>
  );
}
