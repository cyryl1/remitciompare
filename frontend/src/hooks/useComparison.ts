import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { comparisonApi, type ComparisonHistoryParams } from '@/api/comparison';

export function useComparisonHistory(params?: ComparisonHistoryParams) {
  return useQuery({
    queryKey: ['comparison', 'history', params],
    queryFn: () => comparisonApi.history(params),
  });
}

export function useComparison(id: string) {
  return useQuery({
    queryKey: ['comparison', 'detail', id],
    queryFn: () => comparisonApi.get(id),
    enabled: !!id,
  });
}

export function useSaveComparison() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: comparisonApi.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comparison', 'history'] });
    },
  });
}
