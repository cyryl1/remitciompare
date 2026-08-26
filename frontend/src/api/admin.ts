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
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  comparisonCount: number;
  alertCount: number;
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

  users: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient
      .get<{ data: AdminUser[]; total: number }>('/admin/users', { params })
      .then((r) => r.data),

  triggerRateRefresh: () =>
    apiClient.post('/admin/rates/refresh').then((r) => r.data),
};
