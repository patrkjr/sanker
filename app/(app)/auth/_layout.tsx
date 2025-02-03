import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { Stack } from 'expo-router';
import React from 'react';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ presentation: 'card' }}>
      <Stack.Screen
        name="welcome"
        options={{ title: 'Welcome', headerShown: true }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Sign up',
          ...HeaderLargeStyle,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Log in',
          ...HeaderLargeStyle,
        }}
      />
    </Stack>
  );
}
