import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';
import { useSupabase } from '@/context/supabase-provider';
import { Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: 'profile',
};

export default function ProfileLayout() {
  // const { title } = useLocalSearchParams();

  const BACK_BUTTON_TITLE = 'Profile';

  const { user } = useSupabase();

  if (!user) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Profile', ...HeaderLargeStyle }}
      />

      <Stack.Screen
        name="edit-name"
        options={{
          title: 'Edit name',
          presentation: 'modal',
          ...HeaderLargeStyle,
        }}
      />

      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Edit profile',
          headerBackTitle: BACK_BUTTON_TITLE,
          ...HeaderLargeStyle,
        }}
      />

      <Stack.Screen
        name="notification-preferences"
        options={{
          title: 'Notifications',
          headerBackTitle: BACK_BUTTON_TITLE,
          ...HeaderStyle,
        }}
      />

      <Stack.Screen
        name="location-preferences"
        options={{
          headerBackTitle: BACK_BUTTON_TITLE,
          title: 'Location',
          ...HeaderStyle,
        }}
      />

      <Stack.Screen
        name="theme-preferences"
        options={{
          title: 'Theme',
          headerBackTitle: BACK_BUTTON_TITLE,
          ...HeaderStyle,
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          title: 'About Sanker',
          headerBackTitle: BACK_BUTTON_TITLE,
          ...HeaderStyle,
        }}
      />
    </Stack>
  );
}
