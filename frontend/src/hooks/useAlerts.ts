import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi, type CreateAlertDto, type AlertStatus } from '@/api/alerts';

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts', 'list'],
    queryFn: () => alertsApi.list(),
  });
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });
    },
  });
}

export function useUpdateAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateAlertDto & { status: AlertStatus }> }) =>
      alertsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });
    },
  });
}

export function useDeleteAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });
    },
  });
}

export function useToggleAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: alertsApi.toggle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts', 'list'] });
    },
  });
}
