import { create } from 'zustand';

export interface CompareParams {
  sendAmount: number;
  sendCurrency: string;
  receiveCurrency: string;
}

interface CompareState extends CompareParams {
  hasSearched: boolean;
  setParams: (params: CompareParams) => void;
  reset: () => void;
}

const DEFAULT_PARAMS: CompareParams = {
  sendAmount: 500,
  sendCurrency: 'GBP',
  receiveCurrency: 'NGN',
};

export const useCompareStore = create<CompareState>((set) => ({
  ...DEFAULT_PARAMS,
  hasSearched: false,

  setParams: (params) =>
    set({ ...params, hasSearched: true }),

  reset: () =>
    set({ ...DEFAULT_PARAMS, hasSearched: false }),
}));
