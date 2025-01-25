import { useColorScheme } from '@/components/useColorScheme';
import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { DarkTheme, DefaultTheme } from '@/constants/Themes';
import { defaultToastStyles } from '@/constants/ToastsConfig';
import usePreferencesStore from '@/stores/preferenceStore';
import { Toasts, useToasterStore } from '@backpackapp-io/react-native-toast';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import {
  ReanimatedLogLevel,
  configureReanimatedLogger,
} from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

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
  var preferredTheme: 'light' | 'dark' | 'system' = userPreferences.theme;
  if (userPreferences.theme === 'system') {
    preferredTheme = colorScheme;
  }
  const { toasts } = useToasterStore(); //Note, no provider key passed in

  // useEffect(() => {
  //   toasts.forEach((t) => {
  //     toast(t.message, {
  //       ...t,
  //       providerKey: isModalVisible ? 'MODAL::1' : 'DEFAULT', //Switch provider key here
  //     });
  //   });
  // }, [isModalVisible]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={preferredTheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: true,
              title: 'Sign up',
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
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
          </Stack>
        </ThemeProvider>
        <Toasts
          globalAnimationType="spring"
          globalAnimationConfig={{
            duration: 500,
            stiffness: 100,
          }}
          defaultStyle={defaultToastStyles}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
