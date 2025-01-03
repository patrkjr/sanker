import React from 'react';
import { Stack } from 'expo-router';
import { HeaderStyle } from '@/constants/HeaderStyle';

export default function NewMessageLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'New Message', ...HeaderStyle }}
      />
    </Stack>
  );
}
