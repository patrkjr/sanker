import React from 'react';
import { Stack } from 'expo-router';
import { HeaderStyle } from '@/constants/HeaderStyle';

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
    </Stack>
  );
}
