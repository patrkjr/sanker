import React from 'react';
import { Stack } from 'expo-router';
import { HeaderStyle } from '@/constants/HeaderStyle';

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="new-message" options={{ presentation: 'modal' }} />
      <Stack.Screen
        name="chat"
        options={{
          title: 'chat with...',
          headerShown: true,
          headerBackTitle: 'Chats',
          animation: 'default',
          ...HeaderStyle,
        }}
      />
    </Stack>
  );
}
