import React from 'react';
import { Stack } from 'expo-router';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';

export default function NewLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Create', ...HeaderLargeStyle }}
      />
      <Stack.Screen
        name="uploading-item"
        options={{
          title: 'Uploading item',
          headerShown: false,
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen
        name="success"
        options={{ presentation: 'modal', headerShown: false }}
      />

      <Stack.Screen
        name="item/[id]"
        options={{
          headerTitle: '',
          presentation: 'modal',
          title: 'Item for sale',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
