import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme } from '@/constants/Themes';
import HeaderStyle from '@/constants/HeaderStyle';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(root)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
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
          options={{ gestureEnabled: true, title: 'Sign up', ...HeaderStyle }}
        />
        <Stack.Screen
          name="login"
          options={{ gestureEnabled: true, title: 'Log in', ...HeaderStyle }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
