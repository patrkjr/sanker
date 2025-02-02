import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';
import { useSupabase } from '@/context/supabase-provider';
import { Stack } from 'expo-router';
import React from 'react';

export default function ProfileLayout() {
  // const { title } = useLocalSearchParams();

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
          ...HeaderLargeStyle,
        }}
      />

      <Stack.Screen
        name="notification-preferences"
        options={{
          title: 'Notifications',
          ...HeaderStyle,
        }}
      />

      <Stack.Screen
        name="location-preferences"
        options={{
          title: 'Location',
          ...HeaderStyle,
        }}
      />

      <Stack.Screen
        name="theme-preferences"
        options={{
          title: 'Theme',
          ...HeaderStyle,
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          title: 'About Sanker',
          ...HeaderStyle,
        }}
      />
    </Stack>
  );
}
