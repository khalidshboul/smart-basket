import { apiClient } from './client';
import type { MarketItem, CreateMarketItemRequest } from '../types';

const BASE_PATH = '/api/v1/market-items';

export const marketItemApi = {
    /**
     * Get all market items
     */
    getAll: async (): Promise<MarketItem[]> => {
        const response = await apiClient.get<MarketItem[]>(BASE_PATH);
        return response.data;
    },

    /**
     * Create a new market item linked to a reference item
     */
    create: async (data: CreateMarketItemRequest): Promise<MarketItem> => {
        const response = await apiClient.post<MarketItem>(BASE_PATH, data);
        return response.data;
    },

    /**
     * Get a market item by ID
     */
    getById: async (id: string): Promise<MarketItem> => {
        const response = await apiClient.get<MarketItem>(`${BASE_PATH}/${id}`);
        return response.data;
    },

    /**
     * Get all market items for a specific reference item
     */
    getByReferenceItem: async (referenceItemId: string): Promise<MarketItem[]> => {
        const response = await apiClient.get<MarketItem[]>(
            `${BASE_PATH}/by-reference/${referenceItemId}`
        );
        return response.data;
    },

    /**
     * Get all market items for a specific market
     */
    getByMarket: async (marketId: string): Promise<MarketItem[]> => {
        const response = await apiClient.get<MarketItem[]>(
            `${BASE_PATH}/by-market/${marketId}`
        );
        return response.data;
    },

    /**
     * Delete a market item
     */
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE_PATH}/${id}`);
    },
};

