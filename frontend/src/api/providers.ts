import apiClient from './client';

export interface Provider {
  id: string;
  slug: string;
  name: string;
  logoUrl?: string;
  tagline?: string;
  description?: string;
  rating: number;
  reviewCount: number;
  supportedCurrencies: string[];
  deliveryMethods: string[];
  countries: string[];
  features: string[];
  pros: string[];
  cons: string[];
  affiliateUrl?: string;
  isActive: boolean;
  isFeatured?: boolean;
}

export interface ProviderListParams {
  search?: string;
  sendCurrency?: string;
  receiveCurrency?: string;
  deliveryMethod?: string;
  page?: number;
  limit?: number;
}

export const providersApi = {
  list: (params?: ProviderListParams) =>
    apiClient.get<{ data: Provider[]; total: number; page: number; limit: number }>('/providers', { params }).then((r) => r.data),

  getBySlug: (slug: string) =>
    apiClient.get<Provider>(`/providers/${slug}`).then((r) => r.data),

  featured: () =>
    apiClient.get<Provider[]>('/providers/featured').then((r) => r.data),
};
