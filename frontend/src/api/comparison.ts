import apiClient from './client';
import type { RateResult } from './rates';

export interface ComparisonRecord {
  id: string;
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  results: RateResult[];
  selectedProvider?: string;
  createdAt: string;
}

export interface ComparisonHistoryParams {
  page?: number;
  limit?: number;
}

export const comparisonApi = {
  history: (params?: ComparisonHistoryParams) =>
    apiClient
      .get<{ data: ComparisonRecord[]; total: number }>('/comparison/history', { params })
      .then((r) => r.data),

  get: (id: string) =>
    apiClient.get<ComparisonRecord>(`/comparison/${id}`).then((r) => r.data),

  save: (payload: {
    sendAmount: number;
    sendCurrency: string;
    receiveCurrency: string;
    results: RateResult[];
  }) => apiClient.post<ComparisonRecord>('/comparison', payload).then((r) => r.data),
};
