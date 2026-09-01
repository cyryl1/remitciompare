import { create } from 'zustand';

export interface CompareParams {
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
  priority: 'MOST_RECEIVED' | 'FASTEST' | 'LOWEST_COST';
}

interface CompareState extends CompareParams {
  hasSearched: boolean;
  setParams: (params: Partial<CompareParams>) => void;
  reset: () => void;
}

const DEFAULT_PARAMS: CompareParams = {
  sendAmount: 500,
  sendCurrency: 'GBP',
  receiveCurrency: 'NGN',
  priority: 'MOST_RECEIVED',
};

export const useCompareStore = create<CompareState>((set) => ({
  ...DEFAULT_PARAMS,
  hasSearched: false,

  setParams: (params) =>
    set((state) => ({ ...state, ...params, hasSearched: true })),

  reset: () =>
    set({ ...DEFAULT_PARAMS, hasSearched: false }),
}));
