export interface Item {
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
}
