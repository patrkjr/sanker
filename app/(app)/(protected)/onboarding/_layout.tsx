import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ presentation: 'card' }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Onboarding', headerShown: false }}
      />
      <Stack.Screen
        name="profile-picture"
        options={{ title: 'Profile picture' }}
      />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="location" options={{ title: 'Location' }} />
      <Stack.Screen name="theme" options={{ title: 'Theme' }} />
      <Stack.Screen name="done" options={{ title: 'Done' }} />
    </Stack>
  );
}
