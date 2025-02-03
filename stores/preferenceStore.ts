import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the type for the user preferences state
type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  location: {
    use_user_address: boolean;
    show_exact_address: boolean;
  };
  hasSeenOnboarding: boolean;
  hasCompletedOnboarding: boolean;
  hasSeenSetupGuide: boolean;
  notificationsEnabled: boolean;
  lastSeenFeatureVersion: string | null;
  updateFeatureVersion: (version: string) => void;
};

//console.log(Constants.expoConfig?.version);
const CURRENT_VERSION =
  Constants.expoConfig?.extra?.preferenceStore?.version || undefined;

const migrate = (persistedState: any) => {
  console.log(persistedState);
  if (
    persistedState.version < CURRENT_VERSION ||
    typeof persistedState.version === 'string'
  ) {
    // Example migration for adding version and location
    return {
      ...persistedState,
      version: CURRENT_VERSION,
      userPreferences: {
        ...persistedState.userPreferences,
        lastSeenFeatureVersion: null,
        hasSeenOnboarding: false,
        hasCompletedOnboarding: false,
        hasSeenSetupGuide: false,
        location: {
          use_user_address: true,
          show_exact_address: true,
        },
      },
    };
  }
  // Add more migrations as needed for future versions
  return persistedState;
};

type UserPreferencesState = {
  userPreferences: UserPreferences;
  setPreferences: (newPreferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
};

const usePreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      userPreferences: {
        theme: 'system',
        location: {
          use_user_address: true,
          show_exact_address: true,
        },
        hasSeenOnboarding: false,
        hasCompletedOnboarding: false,
        hasSeenSetupGuide: false,
        notificationsEnabled: false,
        lastSeenFeatureVersion: null,
      },
      updateFeatureVersion: (version: string) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            lastSeenFeatureVersion: version,
          },
        })),
      setPreferences: (newPreferences) =>
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            ...newPreferences,
            location: {
              ...state.userPreferences.location,
              ...newPreferences.location,
            },
          },
        })),
      resetPreferences: () =>
        set({
          userPreferences: {
            theme: 'system',
            location: {
              use_user_address: true,
              show_exact_address: true,
            },
            hasSeenOnboarding: false,
            hasCompletedOnboarding: false,
            hasSeenSetupGuide: false,
            notificationsEnabled: false,
            lastSeenFeatureVersion: null,
          },
        }),
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
      migrate,
    }
  )
);

//AsyncStorage.getItem('preferences-store').then((data) => console.log(data));
//AsyncStorage.clear();

export default usePreferencesStore;
