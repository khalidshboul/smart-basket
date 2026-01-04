/**
 * Reference Item API Service
 * NOTE: Backend uses /items endpoint, not /reference-items
 */

import apiClient from './client';
import { ReferenceItem } from '../types';

export const referenceItemApi = {
  /**
   * Get all reference items
   */
  getAll: async (): Promise<ReferenceItem[]> => {
    // Backend endpoint is /items, not /reference-items
    const response = await apiClient.get<ReferenceItem[]>('/items');
    return response.data;
  },

  /**
   * Get active reference items only
   */
  getActive: async (): Promise<ReferenceItem[]> => {
    const items = await referenceItemApi.getAll();
    return items.filter((item) => item.active);
  },

  /**
   * Get reference items by category ID
   */
  getByCategory: async (categoryId: string): Promise<ReferenceItem[]> => {
    const items = await referenceItemApi.getActive();
    return items.filter((item) => item.categoryId === categoryId);
  },

  /**
   * Get reference item by ID
   */
  getById: async (id: string): Promise<ReferenceItem> => {
    const response = await apiClient.get<ReferenceItem>(`/items/${id}`);
    return response.data;
  },

  /**
   * Search reference items by name
   */
  search: async (query: string): Promise<ReferenceItem[]> => {
    const items = await referenceItemApi.getActive();
    const lowerQuery = query.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        (item.nameAr && item.nameAr.includes(query))
    );
  },
};

export default referenceItemApi;
