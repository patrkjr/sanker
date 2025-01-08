import { useColorScheme } from 'react-native';
import usePreferencesStore from '@/stores/preferenceStore';

export function usePreferredTheme() {
  const { userPreferences } = usePreferencesStore();
  const systemTheme = useColorScheme();

  if (userPreferences.theme === 'system') {
    return systemTheme || 'light';
  }

  return userPreferences.theme;
}
