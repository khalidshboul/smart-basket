// ============ Category Types ============

export interface Category {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
    displayOrder: number;
    active: boolean;
}

export interface CreateCategoryRequest {
    name: string;
    icon?: string;
    description?: string;
    displayOrder?: number;
    active?: boolean;
}

// ============ Reference Item Types ============

export interface ReferenceItem {
    id: string;
    name: string;
    categoryId: string;
    category: string; // Denormalized category name
    description: string;
    images: string[];
    availableInAllStores: boolean;
    specificStoreIds: string[];
    linkedStoreIds: string[];
    active: boolean;
}

export interface CreateReferenceItemRequest {
    name: string;
    categoryId: string;
    description?: string;
    images?: string[];
    availableInAllStores?: boolean;
    specificStoreIds?: string[];
}

// ============ Store Types ============

export interface Store {
    id: string;
    name: string;
    location: string;
    logoUrl: string;
    active: boolean;
}

export interface CreateStoreRequest {
    name: string;
    location?: string;
    logoUrl?: string;
}

// ============ Store Item Types ============

export interface StoreItem {
    id: string;
    storeId: string;
    storeName: string;
    referenceItemId: string;
    referenceItemName: string;
    name: string;
    brand: string;
    barcode: string;
    images: string[];
    // Current price info
    currentPrice: number | null;
    originalPrice: number | null;
    discountPercentage: number | null;
    currency: string;
    isPromotion: boolean;
    lastPriceUpdate: string | null;
}

export interface CreateStoreItemRequest {
    storeId: string;
    referenceItemId: string;
    name: string;
    brand?: string;
    barcode?: string;
    images?: string[];
    initialPrice?: number;
    originalPrice?: number;
    currency?: string;
    isPromotion?: boolean;
}

// ============ Price Types ============

export interface StorePrice {
    id: string;
    storeItemId: string;
    price: number;
    originalPrice: number | null;
    currency: string;
    timestamp: string;
    isPromotion: boolean;
}

export interface PriceEntry {
    storeItemId: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    isPromotion?: boolean;
}

export interface BatchPriceUpdateRequest {
    prices: PriceEntry[];
}

export interface PriceUpdateResult {
    storeItemId: string;
    success: boolean;
    message: string;
    newPrice: number | null;
}

export interface BatchPriceUpdateResponse {
    totalRequested: number;
    successCount: number;
    failureCount: number;
    results: PriceUpdateResult[];
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
