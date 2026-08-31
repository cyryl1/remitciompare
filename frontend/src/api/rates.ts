import apiClient from './client';

export interface CompareParams {
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  priority?: string;
}

export interface RateResult {
  providerId: string;
  providerName: string;
  providerSlug: string;
  providerLogo?: string;
  handoffUrl?: string;
  exchangeRate: number;
  fee: number;
  feeType: 'flat' | 'percentage';
  receiveAmount: number;
  deliveryTime: string;
  deliveryMethods: string[];
  transferLimit?: { min: number; max: number };
  affiliateUrl?: string;
  badges?: ('recommended' | 'best_rate' | 'fastest' | 'lowest_fee')[];
  updatedAt: string;
  status?: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
}

export interface RateHistoryPoint {
  date: string;
  rate: number;
  provider: string;
}

export const ratesApi = {
  compare: (params: CompareParams) =>
    apiClient.get<RateResult[]>('/rates/compare', { params }).then((r) => r.data),

  history: (params: { sendCurrency: string; receiveCurrency: string; days?: number }) =>
    apiClient.get<RateHistoryPoint[]>('/rates/history', { params }).then((r) => r.data),

  latest: (params: { sendCurrency: string; receiveCurrency: string }) =>
    apiClient.get<{ rate: number; updatedAt: string }>('/rates/latest', { params }).then((r) => r.data),
};
