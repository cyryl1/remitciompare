import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, type AdminProvider } from '@/api/admin';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.stats(),
  });
}

export function useAdminProviders(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'providers', params],
    queryFn: () => adminApi.providers(params),
  });
}

export function useUpdateAdminProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pick<AdminProvider, 'isActive' | 'isFeatured'>> }) =>
      adminApi.updateProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] });
    },
  });
}

export function useAdminUsers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => adminApi.users(params),
  });
}

export function useTriggerRateRefresh() {
  return useMutation({
    mutationFn: adminApi.triggerRateRefresh,
  });
}

export function useAdminQuotes(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'quotes', params],
    queryFn: () => adminApi.quotes(params),
  });
}

export function useAdminRoutes(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'routes', params],
    queryFn: () => adminApi.routes(params),
  });
}

export function useAdminUpdateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; isActive?: boolean; isFeatured?: boolean }) =>
      adminApi.updateProvider(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] });
    },
  });
}

export function useAdminCreateProvider() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.createProvider>[0]) => adminApi.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'providers'] });
    },
  });
}

export function useAdminUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateRoute(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'routes'] });
    },
  });
}

export function useAdminCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.createRoute>[0]) => adminApi.createRoute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'routes'] });
    },
  });
}

export function useAdminReferrals(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'referrals', params],
    queryFn: () => adminApi.referrals(params),
  });
}

export function useAdminUpdateReferral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; isActive?: boolean; url?: string; utmSource?: string; utmCampaign?: string; utmMedium?: string }) =>
      adminApi.updateReferralLink(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'referrals'] });
    },
  });
}

export function useAdminCreateReferral() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof adminApi.createReferralLink>[0]) => adminApi.createReferralLink(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'referrals'] });
    },
  });
}

export function useAdminCheckAlerts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminApi.triggerAlertCheck(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'alerts'] });
    },
  });
}

export function useAdminAlerts(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'alerts', params],
    queryFn: () => adminApi.alerts(params),
  });
}

export function useAdminHealth(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'health', params],
    queryFn: () => adminApi.health(params),
  });
}

export function useAdminLogs(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['admin', 'logs', params],
    queryFn: () => adminApi.logs(params),
  });
}
