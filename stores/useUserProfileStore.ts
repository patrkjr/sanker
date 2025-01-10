import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserProfile {
  email: string;
  avatar_url?: string;
  avatar_file_name?: string;
  first_name?: string;
  last_name?: string;
  items: Item[];
}

interface Item {
  created_at: string; // Timestamp in ISO format
  title: string; // Title of the item
  price: number; // Numeric price
  condition: 'new' | 'used' | 'worn'; // Enum for condition (new/used/etc.)
  description?: string; // Optional description
  active: boolean; // Is the item active
  owner_id: string; // UUID of the item's owner
  category_id?: string; // Optional category ID
  manufacturer?: string; // Optional manufacturer
  model?: string; // Optional model
  use_user_address: boolean; // Whether to use the user's address
  show_exact_address: boolean; // Whether to show the exact address
  image_urls?: string[][]; // Array of JSONB image URLs
}

interface UserProfileStore {
  userProfile: UserProfile | null;
  setUserProfile: (userProfile: UserProfile) => void;
  clearUserProfile: () => void;
  setItems: (items: Item[]) => void;
}

const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set) => ({
      userProfile: null,
      setUserProfile: (newUserState) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, ...newUserState }
            : newUserState,
        })),
      clearUserProfile: () => set({ userProfile: null }),
      setItems: (items) =>
        set((state) => ({
          userProfile: state.userProfile
            ? { ...state.userProfile, items }
            : null,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserProfileStore;
