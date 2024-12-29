import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';

export default function ProfileLayout() {
  // const { title } = useLocalSearchParams();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Profile', ...HeaderLargeStyle }}
      />
      <Stack.Screen
        name="item/[id]"
        options={{
          headerTitle: '',
          title: 'Item for sale',
          ...HeaderStyle,
        }}
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
        name="listings"
        options={{
          title: 'My listings',
          headerShown: true,
          ...HeaderLargeStyle,
        }}
      />

      <Stack.Screen
        name="account-settings"
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
    </Stack>
  );
}
