import React from 'react';
import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Messages', presentation: 'modal' }}
      />
    </Stack>
  );
}
