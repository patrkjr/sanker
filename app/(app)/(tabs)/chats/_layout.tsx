import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { Stack } from 'expo-router';
import React from 'react';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Messages',
          ...HeaderLargeStyle,
        }}
      />
    </Stack>
  );
}
