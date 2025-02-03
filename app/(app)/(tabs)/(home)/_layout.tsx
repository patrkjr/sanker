import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import usePreferencesStore from '@/stores/preferenceStore';
import { Stack, useRouter } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: '/',
};

export default function HomeLayout() {
  const { userPreferences } = usePreferencesStore();
  const router = useRouter();

  // TODO: Uncomment this when we have a proper onboarding
  // if (!userPreferences.hasSeenOnboarding) {
  //   setTimeout(() => {
  //     router.push('/onboarding');
  //   }, 1000);
  // }

  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="index"
        options={{ title: 'Featured', ...HeaderLargeStyle }}
      />
    </Stack>
  );
}
