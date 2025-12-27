import { apiClient } from './client';
import type { MarketPrice, BatchPriceUpdateRequest, BatchPriceUpdateResponse } from '../types';

const BASE_PATH = '/api/prices';

export const priceApi = {
    /**
     * Update a single item's price
     */
    updatePrice: async (
        marketItemId: string,
        price: number,
        originalPrice?: number,
        currency?: string,
        isPromotion?: boolean
    ): Promise<MarketPrice> => {
        const params = new URLSearchParams();
        params.append('marketItemId', marketItemId);
        params.append('price', price.toString());
        if (originalPrice !== undefined) params.append('originalPrice', originalPrice.toString());
        if (currency) params.append('currency', currency);
        if (isPromotion !== undefined) params.append('isPromotion', isPromotion.toString());

        const response = await apiClient.post<MarketPrice>(`${BASE_PATH}?${params.toString()}`);
        return response.data;
    },

    /**
     * Batch update prices for multiple items
     */
    batchUpdatePrices: async (request: BatchPriceUpdateRequest): Promise<BatchPriceUpdateResponse> => {
        const response = await apiClient.post<BatchPriceUpdateResponse>(
            `${BASE_PATH}/batch`,
            request
        );
        return response.data;
    },

    /**
     * Get price history for a market item
     */
    getPriceHistory: async (marketItemId: string): Promise<MarketPrice[]> => {
        const response = await apiClient.get<MarketPrice[]>(
            `${BASE_PATH}/history/${marketItemId}`
        );
        return response.data;
    },
};
