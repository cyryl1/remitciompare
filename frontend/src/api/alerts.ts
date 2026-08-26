import apiClient from './client';

export type AlertCondition = 'above' | 'below';
export type AlertStatus = 'active' | 'triggered' | 'paused';

export interface Alert {
  id: string;
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  condition: AlertCondition;
  targetRate: number;
  targetReceiveAmount: number;
  currentRate?: number;
  status: AlertStatus;
  notifyEmail: boolean;
  notifyPush: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface CreateAlertDto {
  sendCurrency: string;
  receiveCurrency: string;
  sendAmount: number;
  condition?: AlertCondition;
  targetRate?: number;
  targetReceiveAmount: number;
  notifyEmail?: boolean;
  notifyPush?: boolean;
}

export const alertsApi = {
  list: () =>
    apiClient.get<Alert[]>('/alerts').then((r) => r.data),

  create: (dto: CreateAlertDto) =>
    apiClient.post<Alert>('/alerts', dto).then((r) => r.data),

  update: (id: string, dto: Partial<CreateAlertDto & { status: AlertStatus }>) =>
    apiClient.patch<Alert>(`/alerts/${id}`, dto).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/alerts/${id}`).then((r) => r.data),

  toggle: (id: string) =>
    apiClient.patch<Alert>(`/alerts/${id}/toggle`).then((r) => r.data),
};
