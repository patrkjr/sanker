import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';

// Define the type for the user preferences state
type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
};

type UserPreferencesState = {
  userPreferences: UserPreferences;
  setPreferences: (newPreferences: Partial<UserPreferences>) => void;
};

const usePreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      userPreferences: {
        theme: 'system',
        notificationsEnabled: true,
      },
      setPreferences: (newPreferences) =>
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...newPreferences },
        })),
    }),
    {
      name: 'preferences-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default usePreferencesStore;
