/**
 * Basket Comparison API Service
 */

import apiClient from './client';
import { BasketComparisonRequest, BasketComparisonResponse } from '../types';

export const basketApi = {
  /**
   * Compare basket prices across stores
   */
  compare: async (referenceItemIds: string[]): Promise<BasketComparisonResponse> => {
    const request: BasketComparisonRequest = { referenceItemIds };
    const response = await apiClient.post<BasketComparisonResponse>(
      '/basket/compare',
      request
    );
    return response.data;
  },
};

export default basketApi;
