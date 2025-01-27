export interface FormData {
  image_urls: string[];
  price: string | null;
  title: string | null;
  condition: string | null;
  description: string | null;
  use_user_address: boolean | null;
  show_exact_address: boolean | null;
  category_slug: string | null;
  manufacturer: string | null;
  model: string | null;
}
