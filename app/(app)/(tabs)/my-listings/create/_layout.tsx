import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';
import { Stack } from 'expo-router';
import React from 'react';

export default function CreateFormLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Create',
          ...HeaderLargeStyle,
        }}
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

      <Stack.Screen
        name="pick-category"
        options={{
          title: 'Pick category',
          presentation: 'modal',
          ...HeaderStyle,
        }}
      />
    </Stack>
  );
}
