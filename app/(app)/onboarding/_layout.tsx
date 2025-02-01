import { Stack } from 'expo-router';
import React from 'react';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Onboarding', headerShown: false }}
      />
    </Stack>
  );
}
