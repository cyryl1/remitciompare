import { apiClient } from './client';

export interface UpdatePreferencesDto {
  fullName?: string;
  countryOfResidence?: string;
  defaultRoute?: string;
  emailAlerts?: boolean;
  comparisonNotifications?: boolean;
  marketingEmails?: boolean;
}

export const userApi = {
  getPreferences: () => apiClient.get('/users/preferences').then((r) => r.data),
  updatePreferences: (data: UpdatePreferencesDto) =>
    apiClient.patch('/users/preferences', data).then((r) => r.data),
    
  getSavedRoutes: () => apiClient.get('/users/saved-routes').then((r) => r.data),
  addSavedRoute: (data: { fromCurrency: string; toCurrency: string; fromCountry: string; toCountry: string; label?: string }) =>
    apiClient.post('/users/saved-routes', data).then((r) => r.data),
  removeSavedRoute: (id: string) => apiClient.delete(`/users/saved-routes/${id}`).then((r) => r.data),
  
  deleteAccount: () => apiClient.delete('/users/me').then((r) => r.data),
  requestDataArchive: () => apiClient.post('/users/me/request-data').then((r) => r.data),
};
