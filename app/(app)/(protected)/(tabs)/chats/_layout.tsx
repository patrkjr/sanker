import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Messages', ...HeaderLargeStyle }}
      />
    </Stack>
  );
}
