import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import Constants from 'expo-constants';

// Define the type for the user preferences state
type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  location: {
    use_user_address: boolean;
    show_exact_address: boolean;
  };
  hasSeenOnboarding: boolean;
  notificationsEnabled: boolean;
};

//console.log(Constants.expoConfig?.version);
const CURRENT_VERSION = Constants.expoConfig?.version || 0;

const migrate = (persistedState: any) => {
  if (
    persistedState.version < CURRENT_VERSION ||
    persistedState.version === undefined
  ) {
    // Example migration for adding version and location
    return {
      ...persistedState,
      version: CURRENT_VERSION,
      userPreferences: {
        ...persistedState.userPreferences,
        hasSeenOnboarding: false,
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
        notificationsEnabled: false,
      },
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
            notificationsEnabled: false,
          },
        }),
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: CURRENT_VERSION,
      migrate,
    }
  )
);

//AsyncStorage.getItem('preferences-store').then((data) => console.log(data));

export default usePreferencesStore;
