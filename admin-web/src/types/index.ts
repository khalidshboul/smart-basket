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
    availableInAllMarkets: boolean;
    specificMarketIds: string[];
    linkedMarketIds: string[];
    active: boolean;
}

export interface CreateReferenceItemRequest {
    name: string;
    categoryId: string;
    description?: string;
    images?: string[];
    availableInAllMarkets?: boolean;
    specificMarketIds?: string[];
}

// ============ Market Types ============

export interface Market {
    id: string;
    name: string;
    location: string;
    logoUrl: string;
    active: boolean;
}

export interface CreateMarketRequest {
    name: string;
    location?: string;
    logoUrl?: string;
}

// ============ Market Item Types ============

export interface MarketItem {
    id: string;
    marketId: string;
    marketName: string;
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

export interface CreateMarketItemRequest {
    marketId: string;
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

export interface MarketPrice {
    id: string;
    marketItemId: string;
    price: number;
    originalPrice: number | null;
    currency: string;
    timestamp: string;
    isPromotion: boolean;
}

export interface PriceEntry {
    marketItemId: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    isPromotion?: boolean;
}

export interface BatchPriceUpdateRequest {
    prices: PriceEntry[];
}

export interface PriceUpdateResult {
    marketItemId: string;
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
    marketComparisons: MarketComparisonResult[];
    cheapestMarketId: string | null;
    cheapestMarketName: string | null;
    lowestTotal: number;
    highestTotal: number;
    potentialSavings: number;
}

export interface BasketItemInfo {
    referenceItemId: string;
    name: string;
    category: string;
}

export interface MarketComparisonResult {
    marketId: string;
    marketName: string;
    marketLogoUrl: string;
    totalPrice: number;
    currency: string;
    allItemsAvailable: boolean;
    itemPrices: MarketItemPriceInfo[];
    missingItems: string[];
    availableItemCount: number;
    totalItemCount: number;
}

export interface MarketItemPriceInfo {
    referenceItemId: string;
    referenceItemName: string;
    marketItemId: string;
    marketItemName: string;
    brand: string;
    price: number;
    currency: string;
    isPromotion: boolean;
    available: boolean;
}
