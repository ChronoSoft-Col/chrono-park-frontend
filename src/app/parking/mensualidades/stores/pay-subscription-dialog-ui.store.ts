"use client";

import { create } from "zustand";

type PaySubscriptionDialogUiState = {
  isSubmitting: boolean;
  isValid: boolean;
  loadingPrice: boolean;
};

type PaySubscriptionDialogUiActions = {
  setUi: (next: Partial<PaySubscriptionDialogUiState>) => void;
  reset: () => void;
};

type PaySubscriptionDialogUiStore = PaySubscriptionDialogUiState &
  PaySubscriptionDialogUiActions;

const initialState: PaySubscriptionDialogUiState = {
  isSubmitting: false,
  isValid: false,
  loadingPrice: false,
};

export const usePaySubscriptionDialogUiStore = create<PaySubscriptionDialogUiStore>((set) => ({
  ...initialState,
  setUi: (next) => set(next),
  reset: () => set(initialState),
}));
