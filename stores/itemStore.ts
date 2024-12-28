import { create } from 'zustand';

interface ItemState {
  item: {
    id: string;
    image_urls: string[];
    price: string;
    title: string;
    condition: string;
    description: string;
    use_user_address: boolean;
    show_exact_address: boolean;
    owner_id: string;
    category_id: string;
    manufacturer: string;
    model: string;
    active: boolean;
  } | null;
  setItem: (item: Partial<ItemState>) => void;
}

const useItemStore = create<ItemState>((set) => ({
  item: null,
  setItem: (item) => set((state) => ({ ...state, item })),
}));

export default useItemStore;
