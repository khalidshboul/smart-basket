import { apiClient } from './client';
import type { Market, CreateMarketRequest } from '../types';

const BASE_PATH = '/api/v1/markets';

export const marketApi = {
    getAll: async (): Promise<Market[]> => {
        const response = await apiClient.get<Market[]>(BASE_PATH);
        return response.data;
    },

    getActive: async (): Promise<Market[]> => {
        const response = await apiClient.get<Market[]>(`${BASE_PATH}/active`);
        return response.data;
    },

    getById: async (id: string): Promise<Market> => {
        const response = await apiClient.get<Market>(`${BASE_PATH}/${id}`);
        return response.data;
    },

    create: async (data: CreateMarketRequest): Promise<Market> => {
        const response = await apiClient.post<Market>(BASE_PATH, data);
        return response.data;
    },

    update: async (id: string, data: CreateMarketRequest): Promise<Market> => {
        const response = await apiClient.put<Market>(`${BASE_PATH}/${id}`, data);
        return response.data;
    },

    toggleStatus: async (id: string): Promise<Market> => {
        const response = await apiClient.patch<Market>(`${BASE_PATH}/${id}/toggle-status`);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE_PATH}/${id}`);
    },
};
