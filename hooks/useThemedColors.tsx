import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import usePreferencesStore from '@/stores/preferenceStore';
import { useTheme } from '@react-navigation/native';

export function useThemedColors() {
  const { userPreferences } = usePreferencesStore();

  // const themePreference = userPreferences.theme;
  // const theme =
  //   themePreference === 'system'
  //     ? useColorScheme() || 'light'
  //     : themePreference;

  const { dark } = useTheme();
  const theme = dark ? 'dark' : 'light';
  return Colors[theme];
}
