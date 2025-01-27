import type { FormData } from '@/components/create/types/formTypes';
import usePreferencesStore from '@/stores/preferenceStore';

export function useDefaultFormValues(): FormData {
  const { userPreferences } = usePreferencesStore();

  return {
    image_urls: [],
    price: '',
    title: '',
    condition: '',
    description: '',
    category_slug: null,
    use_user_address: userPreferences.location.use_user_address,
    show_exact_address: userPreferences.location.show_exact_address,
    manufacturer: null,
    model: null,
  };
}
