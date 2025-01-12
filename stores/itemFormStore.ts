import { create } from 'zustand';

interface ItemFormState {
  data: {
    image_urls: string[];
    price: string;
    title: string;
    condition: string;
    description: string;
    use_user_address: boolean;
    show_exact_address: boolean;
    category_slug: string | null;
    manufacturer: string;
    model: string;
  };
  setForm: (data: Partial<ItemFormState>) => void;
  resetForm: () => void;
}

const useItemFormStore = create<ItemFormState>((set) => ({
  data: {
    image_urls: [],
    price: '',
    title: '',
    condition: '',
    description: '',
    category_slug: null,
    manufacturer: '',
    model: '',
    use_user_address: true,
    show_exact_address: true,
  },
  setForm: (data) =>
    set((state) => ({ ...state, data: { ...state.data, ...data } })),
  resetForm: () =>
    set({
      data: {
        image_urls: [],
        price: '',
        title: '',
        condition: '',
        description: '',
        use_user_address: true,
        show_exact_address: true,
        category_slug: null,
        manufacturer: '',
        model: '',
      },
    }),
}));

export default useItemFormStore;
