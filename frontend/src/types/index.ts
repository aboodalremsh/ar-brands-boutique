export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Profile {
  id: string;
  email: string | null;
  is_admin: boolean;
  created_at: string;
}
