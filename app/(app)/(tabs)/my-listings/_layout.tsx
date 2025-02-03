import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { useSupabase } from '@/context/supabase-provider';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: 'my-listings',
};

export default function ListingsLayout() {
  const { user } = useSupabase();

  if (!user) {
    return <Redirect href="/auth" push />;
  }

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
