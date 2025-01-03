import React from 'react';
import { Stack } from 'expo-router';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Chats', ...HeaderLargeStyle }}
      />

      <Stack.Screen
        name="[id]"
        options={{ title: 'Chat with x', ...HeaderStyle }}
      />
    </Stack>
  );
}
