import { HeaderStyle } from '@/constants/HeaderStyle';
import { Stack } from 'expo-router';
import React from 'react';

export default function ProtectedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="chat/[id]"
        options={{
          title: 'Chat',
          headerTitle: 'Chat',
          headerBackTitle: 'Back',
          animation: 'default',
          ...HeaderStyle,
        }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          title: 'Item',
          headerBackTitle: 'Back',
          headerTitle: '',
          ...HeaderStyle,
        }}
      />
    </Stack>
  );
}
