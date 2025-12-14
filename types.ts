export type Language = 'en' | 'th';

export interface LocalizedString {
  en: string;
  th: string;
}

export interface MenuCategory {
  id: string;
  name: LocalizedString;
  items: MenuItem[];
}

export interface ImageEnhancement {
  brightness: number;
  contrast: number;
  saturation: number;
}

export type SpicinessLevel = 'none' | 'mild' | 'medium' | 'hot';

export interface DietaryInfo {
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  spiciness: SpicinessLevel;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  image?: string;
  imageEnhancement?: ImageEnhancement; // AI suggested filters
  tags?: string[]; // e.g., 'Best Seller', 'New'
  dietaryInfo: DietaryInfo;
  isAvailable: boolean;
}

export interface MenuStyle {
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  layout: 'list' | 'grid';
}

export interface MenuTemplate {
  id: string;
  name: string;
  description: string;
  style: MenuStyle;
  thumbnail: string;
}

export interface RestaurantInfo {
  headerImage?: string;
  openingHours: string;
  address: string;
  googleMapsLink?: string;
  phone?: string;
}

export interface Menu {
  id: string;
  name: string;
  restaurantInfo: RestaurantInfo;
  style: MenuStyle;
  categories: MenuCategory[];
}

export type ViewMode = 'owner-dashboard' | 'owner-editor' | 'diner-view' | 'analytics';

// Analytics Types
export interface DailyView {
  date: string;
  views: number;
  orders: number;
}

export interface PopularItem {
  name: string;
  views: number;
}