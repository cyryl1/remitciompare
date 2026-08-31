import apiClient from './client';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalComparisons: number;
  comparisonsToday: number;
  totalAlerts: number;
  activeAlerts: number;
  totalProviders: number;
  activeProviders: number;
  topCorridors: { from: string; to: string; count: number }[];
  recentSignups: number;
  recentAlerts: {
    id: string;
    fromCurrency: string;
    toCurrency: string;
    targetRecipientAmount: number;
    triggeredProvider: string | null;
    lastTriggeredAt: string | null;
    user: { email: string };
  }[];
}

export interface AdminProvider {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  lastRateUpdate?: string;
  totalComparisons: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string | null;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  comparisonCount: number;
  alertCount: number;
}

export interface AdminQuote {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromCountry: string;
  toCountry: string;
  sendAmount: number;
  priority: string;
  createdAt: string;
  user: { email: string; fullName: string | null } | null;
  quotes: { provider: string; recipientAmount: number; status: string }[];
}

export interface AdminRoute {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromCountry: string | null;
  toCountry: string | null;
  isActive: boolean;
  createdAt: string;
  provider: { name: string; slug: string; isActive: boolean };
}

export interface AdminReferralLink {
  id: string;
  provider: string; // slug
  url: string;
  utmSource: string | null;
  utmCampaign: string | null;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
}

export interface AdminAlert {
  id: string;
  user: { email: string; fullName: string | null };
  fromCurrency: string;
  toCurrency: string;
  sendAmount: number;
  targetRecipientAmount: number;
  priority: string;
  status: string;
  lastCheckedAt: string | null;
  lastTriggeredAt: string | null;
  createdAt: string;
}

export interface AdminHealthLog {
  id: string;
  provider: string;
  route: string;
  errorType: string;
  errorDetail: string | null;
  createdAt: string;
}

export interface AdminActivityLog {
  id: string;
  userId: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  metadata: any | null;
  ipAddress: string | null;
  createdAt: string;
}

export const adminApi = {
  stats: () =>
    apiClient.get<AdminStats>('/admin/stats').then((r) => r.data),

  providers: (params?: { page?: number; limit?: number }) =>
    apiClient
      .get<{ data: AdminProvider[]; total: number }>('/admin/providers', { params })
      .then((r) => r.data),

  updateProvider: (id: string, dto: Partial<Pick<AdminProvider, 'isActive' | 'isFeatured'>>) =>
    apiClient.patch<AdminProvider>(`/admin/providers/${id}`, dto).then((r) => r.data),

  createProvider: (data: { name: string; slug: string; websiteUrl?: string; isActive?: boolean; isFeatured?: boolean }) =>
    apiClient.post('/admin/providers', data).then((r) => r.data),

  routes: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminRoute[]; total: number }>('/admin/routes', { params })
      .then((r) => r.data),

  updateRoute: (id: string, dto: { isActive: boolean }) =>
    apiClient.patch<AdminRoute>(`/admin/routes/${id}`, dto).then((r) => r.data),

  createRoute: (data: { providerId: string; fromCurrency: string; toCurrency: string; fromCountry?: string; toCountry?: string; isActive?: boolean }) =>
    apiClient.post('/admin/routes', data).then((r) => r.data),

  referrals: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminReferralLink[]; total: number }>('/admin/referrals', { params })
      .then((r) => r.data),

  updateReferralLink: (id: string, dto: { isActive?: boolean; url?: string; utmSource?: string; utmCampaign?: string; utmMedium?: string }) =>
    apiClient.patch<AdminReferralLink>(`/admin/referrals/${id}`, dto).then((r) => r.data),

  createReferralLink: (data: { providerId: string; url: string; utmSource?: string; utmCampaign?: string; utmMedium?: string; isActive?: boolean }) =>
    apiClient.post('/admin/referrals', data).then((r) => r.data),

  triggerAlertCheck: () =>
    apiClient.post('/admin/alerts/check').then((r) => r.data),

  users: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminUser[]; total: number }>('/admin/users', { params })
      .then((r) => r.data),

  alerts: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminAlert[]; total: number }>('/admin/alerts', { params })
      .then((r) => r.data),

  health: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminHealthLog[]; total: number }>('/admin/health', { params })
      .then((r) => r.data),

  logs: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminActivityLog[]; total: number }>('/admin/logs', { params })
      .then((r) => r.data),

  quotes: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminQuote[]; total: number }>('/admin/quotes', { params })
      .then((r) => r.data),
};
