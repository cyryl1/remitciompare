import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ratesApi, type CompareParams } from '@/api/rates';

export function useCompareRates(params: CompareParams) {
  return useQuery({
    queryKey: ['rates', 'compare', params],
    queryFn: () => ratesApi.compare(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.sendAmount && !!params.sendCurrency && !!params.receiveCurrency,
  });
}

export function useRateHistory(params: { sendCurrency: string; receiveCurrency: string; days?: number }) {
  return useQuery({
    queryKey: ['rates', 'history', params],
    queryFn: () => ratesApi.history(params),
    staleTime: 1000 * 60 * 60, // 1 hour
    enabled: !!params.sendCurrency && !!params.receiveCurrency,
  });
}

export function useLatestRate(params: { sendCurrency: string; receiveCurrency: string }) {
  return useQuery({
    queryKey: ['rates', 'latest', params],
    queryFn: () => ratesApi.latest(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!params.sendCurrency && !!params.receiveCurrency,
  });
}
