/**
 * Category API Service
 */

import apiClient from './client';
import { Category } from '../types';

export const categoryApi = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Get active categories only
   */
  getActive: async (): Promise<Category[]> => {
    const categories = await categoryApi.getAll();
    return categories
      .filter((c) => c.active)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  /**
   * Get category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },
};

export default categoryApi;
