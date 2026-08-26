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
