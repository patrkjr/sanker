import { create } from 'zustand';
import type { Item } from '../types/itemTypes';

interface ItemState {
  item: Item | null;
  setItem: (item: Partial<ItemState>) => void;
}

const useItemStore = create<ItemState>((set) => ({
  item: null,
  setItem: (item) => set((state) => ({ ...state, item })),
}));

export default useItemStore;
