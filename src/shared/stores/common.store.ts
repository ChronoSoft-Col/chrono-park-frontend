"use client"

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getCommonAction } from "@/src/app/global-actions/get-common.action";
import { EServices } from "../enums/common/services.enum";
import { TVehicleType } from "../types/common/vehicle-types.type";
import { TPaymentMethods } from "../types/common/payment-methods.type";
import { TDocumentType } from "../types/common/document-types.type";
import { TAdditionalService } from "../types/common/additional-service.type";

type TCommonState = {
  vehicleTypes: TVehicleType[];
  paymentMethods: TPaymentMethods[];
  documentTypes: TDocumentType[];
  additionalServices: TAdditionalService[];
  isLoading: boolean;
  hasFetched: boolean;
};

type TCommonActions = {
  fetchCommonData: () => Promise<void>;
  refetch: () => Promise<void>;
};

type TCommonStore = TCommonState & TCommonActions;

export const useCommonStore = create<TCommonStore>()(
  persist(
    (set, get) => ({
      // Initial state
      vehicleTypes: [],
      paymentMethods: [],
      documentTypes: [],
      additionalServices: [],
      isLoading: false,
      hasFetched: false,

      fetchCommonData: async () => {
        // Prevent duplicate fetches only if we have data
        const state = get();
        if (state.isLoading) return;
        
        // If we already have data, don't refetch
        if (state.hasFetched && state.paymentMethods.length > 0) return;

        set({ isLoading: true });

        try {
          const [vehicleTypes, paymentMethods, documentTypes, additionalServices] = await Promise.all([
            getCommonAction<TVehicleType[]>(EServices.VEHICLE_TYPES),
            getCommonAction<TPaymentMethods[]>(EServices.PAYMENT_METHODS),
            getCommonAction<TDocumentType[]>(EServices.DOCUMENT_TYPES),
            getCommonAction<TAdditionalService[]>(EServices.ADDITIONAL_SERVICES),
          ]);

          console.log("Common data loaded:", { vehicleTypes, paymentMethods, documentTypes, additionalServices });

          const newPaymentMethods = paymentMethods.data?.data || [];
          
          set({
            vehicleTypes: vehicleTypes.data?.data || [],
            paymentMethods: newPaymentMethods,
            documentTypes: documentTypes.data?.data || [],
            additionalServices: additionalServices.data?.data || [],
            // Only mark as fetched if we actually got data
            hasFetched: newPaymentMethods.length > 0,
          });
        } catch (error) {
          console.error("Error loading common data:", error);
          // Reset hasFetched so it retries on next mount
          set({ hasFetched: false });
        } finally {
          set({ isLoading: false });
        }
      },

      refetch: async () => {
        set({ hasFetched: false });
        await get().fetchCommonData();
      },
    }),
    {
      name: "chrono-common-data",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        vehicleTypes: state.vehicleTypes,
        paymentMethods: state.paymentMethods,
        documentTypes: state.documentTypes,
        additionalServices: state.additionalServices,
        hasFetched: state.hasFetched,
      }),
    }
  )
);
