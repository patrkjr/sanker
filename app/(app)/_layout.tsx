import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme } from '@/constants/Themes';
import { HeaderLargeStyle } from '@/constants/HeaderStyle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(app)',
};

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
