import type { FormData } from '@/components/create/types/formTypes';
import { create } from 'zustand';

interface ItemFormState {
  formData: FormData;
  isDraft: boolean;
  setForm: (formData: Partial<ItemFormState['formData']>) => void;
  resetForm: (initialFormData?: Partial<ItemFormState['formData']>) => void;
  setIsDraft: (isDraft: boolean) => void;
}

const useItemFormStore = create<ItemFormState>((set) => ({
  formData: {
    image_urls: [],
    price: null,
    title: null,
    condition: null,
    description: null,
    category_slug: null,
    manufacturer: null,
    model: null,
    use_user_address: null,
    show_exact_address: null,
  },
  isDraft: false,
  setForm: (formData) =>
    set((state) => ({
      ...state,
      formData: { ...state.formData, ...formData },
    })),
  resetForm: (initialFormData = {}) =>
    set({
      formData: {
        image_urls: [],
        price: null,
        title: null,
        condition: null,
        description: null,
        use_user_address: null,
        show_exact_address: null,
        category_slug: null,
        manufacturer: null,
        model: null,
        ...initialFormData,
      },
      isDraft: false,
    }),
  setIsDraft: (isDraft) => set({ isDraft }),
}));

export default useItemFormStore;
