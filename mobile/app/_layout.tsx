/**
 * Root Layout - App-wide providers and navigation
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider, LanguageProvider } from '../src/context';

export default function RootLayout() {
  return (
    <LanguageProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen 
            name="cart" 
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen name="comparison/results" />
        </Stack>
      </CartProvider>
    </LanguageProvider>
  );
}
