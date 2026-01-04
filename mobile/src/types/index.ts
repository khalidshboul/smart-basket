/**
 * Smart Basket - Type Definitions
 * Matching backend API models
 */

// ============ Category Types ============

export interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  icon: string | null;
  description: string | null;
  descriptionAr: string | null;
  displayOrder: number;
  active: boolean;
}

// ============ Reference Item Types ============

export interface ReferenceItem {
  id: string;
  name: string;
  nameAr: string | null;
  categoryId: string;
  category: string;
  description: string;
  descriptionAr: string | null;
  images: string[];
  availableInAllStores: boolean;
  specificStoreIds: string[];
  active: boolean;
}

// ============ Store Types ============

export interface Store {
  id: string;
  name: string;
  nameAr: string | null;
  location: string;
  locationAr: string | null;
  logoUrl: string;
  active: boolean;
}

// ============ Store Item Types ============

export interface StoreItem {
  id: string;
  storeId: string;
  storeName: string;
  referenceItemId: string;
  referenceItemName: string;
  name: string;
  nameAr: string | null;
  brand: string;
  barcode: string;
  images: string[];
  discountPrice: number | null;
  originalPrice: number | null;
  discountPercentage: number | null;
  currency: string;
  isPromotion: boolean;
  lastPriceUpdate: string | null;
}

// ============ Basket Comparison Types ============

export interface BasketComparisonRequest {
  referenceItemIds: string[];
}

export interface BasketComparisonResponse {
  basketItems: BasketItemInfo[];
  storeComparisons: StoreComparisonResult[];
  cheapestStoreId: string | null;
  cheapestStoreName: string | null;
  lowestTotal: number;
  highestTotal: number;
  potentialSavings: number;
}

export interface BasketItemInfo {
  referenceItemId: string;
  name: string;
  category: string;
}

export interface StoreComparisonResult {
  storeId: string;
  storeName: string;
  storeLogoUrl: string;
  totalPrice: number;
  currency: string;
  allItemsAvailable: boolean;
  itemPrices: StoreItemPriceInfo[];
  missingItems: string[];
  availableItemCount: number;
  totalItemCount: number;
}

export interface StoreItemPriceInfo {
  referenceItemId: string;
  referenceItemName: string;
  storeItemId: string;
  storeItemName: string;
  brand: string;
  price: number;
  currency: string;
  isPromotion: boolean;
  available: boolean;
}

// ============ Cart Types (Local) ============

export interface CartItem {
  referenceItem: ReferenceItem;
  quantity: number;
}
