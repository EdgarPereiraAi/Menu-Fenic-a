
export type Language = 'pt' | 'en' | 'fr' | 'de';

export interface MenuItem {
  id: string;
  code: string;
  name: Record<Language, string>;
  description?: Record<Language, string>;
  price: number;
  image?: string;
}

export interface MenuCategory {
  id: string;
  title: Record<Language, string>;
  items: MenuItem[];
}

export interface Contact {
  id: string;
  label: string;
  value: string;
}

export interface MenuData {
  categories: MenuCategory[];
  contacts: Contact[];
  address?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}
