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
      },
    }),
}));

export default useItemFormStore;
