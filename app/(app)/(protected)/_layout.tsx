import React from 'react';
import { Stack } from 'expo-router';

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="new-message" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
