import { useQuery } from '@tanstack/react-query';
import { providersApi, type ProviderListParams } from '@/api/providers';

export function useProviders(params?: ProviderListParams) {
  return useQuery({
    queryKey: ['providers', 'list', params],
    queryFn: () => providersApi.list(params),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useProvider(slug: string) {
  return useQuery({
    queryKey: ['providers', 'detail', slug],
    queryFn: () => providersApi.getBySlug(slug),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!slug,
  });
}

export function useFeaturedProviders() {
  return useQuery({
    queryKey: ['providers', 'featured'],
    queryFn: () => providersApi.featured(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
