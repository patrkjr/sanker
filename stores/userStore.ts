import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  full_name?: string;
  items: Item[];
}

interface Item {
  id: string; // UUID of the item
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

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
  setItems: (items: Item[]) => void;
}

const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      setItems: (items) =>
        set((state) => ({
          user: state.user ? { ...state.user, items } : null,
        })),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;
