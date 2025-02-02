import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { Stack } from 'expo-router';
import React from 'react';

export default function ListingsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'My listings', ...HeaderLargeStyle }}
      />
      <Stack.Screen
        name="create"
        options={{ headerShown: false, presentation: 'modal' }}
      />
      <Stack.Screen
        name="listings"
        options={{ title: 'Listings', ...HeaderLargeStyle }}
      />
    </Stack>
  );
}
