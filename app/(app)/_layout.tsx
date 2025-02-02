import ProgressWidget from '@/components/progress-widget/ProgressWidget';
import { useColorScheme } from '@/components/useColorScheme';
import { HeaderLargeStyle, HeaderStyle } from '@/constants/HeaderStyle';
import { DarkTheme, DefaultTheme } from '@/constants/Themes';
import usePreferencesStore from '@/stores/preferenceStore';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import 'react-native-reanimated';
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { userPreferences } = usePreferencesStore();
  // const [preferredTheme, setPrefferedTheme] = useState<string>('light');
  let preferredTheme: 'light' | 'dark' | 'system' = userPreferences.theme;
  if (userPreferences.theme === 'system') {
    preferredTheme = colorScheme;
  }

  return (
    <ThemeProvider value={preferredTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="welcome"
          options={{ title: 'Welcome', headerShown: false }}
        />
        <Stack.Screen
          name="signup"
          options={{
            gestureEnabled: true,
            title: 'Sign up',
            ...HeaderLargeStyle,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            gestureEnabled: true,
            title: 'Log in',
            ...HeaderLargeStyle,
          }}
        />
        <Stack.Screen
          name="item/[id]"
          options={{
            title: 'Item',
            headerTitle: '',
            headerBackTitle: 'Back',
            ...HeaderStyle,
          }}
        />

        <Stack.Screen
          name="onboarding"
          options={{
            title: 'Onboarding',
            presentation: 'modal',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="fullscreen-profile-picture"
          options={{
            presentation: 'transparentModal',
            animation: 'none',
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
      <ProgressWidget />
    </ThemeProvider>
  );
}
