"use client"

import { create } from "zustand";
import { getPaymentsReportAction } from "@/src/app/parking/admin/reportes/actions/get-payments-report.action";
import { getCommonAction } from "@/src/app/global-actions/get-common.action";
import { EServices } from "@/src/shared/enums/common/services.enum";
import {
  IChargeableFilter,
} from "@/server/domain/entities/parking/reports/params/get-payments-report-params.entity";
import {
  IPaymentsReportData,
  IReportSentByEmailData,
  IReportRequiresEmailData,
  TPaymentsReportResponse,
} from "@/server/domain/entities/parking/reports/response/payments-report-response.entity";

type TReportResponseType = "data" | "sent" | "needsEmail" | null;

type TReportState = {
  // Filters
  startDate: string;
  endDate: string;
  selectedFilters: IChargeableFilter[];

  // Chargeable catalog options
  chargeableOptions: IChargeableFilter[];
  isLoadingOptions: boolean;

  // Report data
  reportData: IPaymentsReportData | null;
  sentByEmailData: IReportSentByEmailData | null;
  requiresEmailData: IReportRequiresEmailData | null;
  responseType: TReportResponseType;

  // Loading & error
  isLoading: boolean;
  error: string | null;
};

type TReportActions = {
  setDateRange: (startDate: string, endDate: string) => void;
  setSelectedFilters: (filters: IChargeableFilter[]) => void;
  fetchChargeableOptions: () => Promise<void>;
  generateReport: (emails?: string[]) => Promise<void>;
  reset: () => void;
};

type TReportStore = TReportState & TReportActions;

function getDefaultDateRange() {
  const now = new Date();
  const endDate = now.toISOString().split("T")[0];
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
  return { startDate, endDate };
}

function classifyResponse(data: TPaymentsReportResponse): {
  type: TReportResponseType;
  reportData: IPaymentsReportData | null;
  sentByEmailData: IReportSentByEmailData | null;
  requiresEmailData: IReportRequiresEmailData | null;
} {
  if ("payments" in data) {
    return { type: "data", reportData: data as IPaymentsReportData, sentByEmailData: null, requiresEmailData: null };
  }
  if ("sentByEmail" in data && (data as IReportSentByEmailData).sentByEmail) {
    return { type: "sent", reportData: null, sentByEmailData: data as IReportSentByEmailData, requiresEmailData: null };
  }
  if ("requiresEmail" in data && (data as IReportRequiresEmailData).requiresEmail) {
    return { type: "needsEmail", reportData: null, sentByEmailData: null, requiresEmailData: data as IReportRequiresEmailData };
  }
  return { type: null, reportData: null, sentByEmailData: null, requiresEmailData: null };
}

const defaultRange = getDefaultDateRange();

export const useReportStore = create<TReportStore>()((set, get) => ({
  // Filters
  startDate: defaultRange.startDate,
  endDate: defaultRange.endDate,
  selectedFilters: [],

  // Chargeable options
  chargeableOptions: [],
  isLoadingOptions: false,

  // Report data
  reportData: null,
  sentByEmailData: null,
  requiresEmailData: null,
  responseType: null,

  // Loading & error
  isLoading: false,
  error: null,

  setDateRange: (startDate, endDate) => set({ startDate, endDate }),

  setSelectedFilters: (filters) => set({ selectedFilters: filters }),

  fetchChargeableOptions: async () => {
    if (get().isLoadingOptions || get().chargeableOptions.length > 0) return;
    set({ isLoadingOptions: true });
    try {
      const result = await getCommonAction<IChargeableFilter[]>(EServices.CHARGEABLE_CATALOG);
      if (result.success && result.data?.data) {
        set({ chargeableOptions: result.data.data });
      }
    } catch {
      // Silently fail — options are optional
    } finally {
      set({ isLoadingOptions: false });
    }
  },

  generateReport: async (emails) => {
    const { startDate, endDate, selectedFilters } = get();
    set({
      isLoading: true,
      error: null,
      reportData: null,
      sentByEmailData: null,
      requiresEmailData: null,
      responseType: null,
    });

    try {
      const result = await getPaymentsReportAction({
        startDate: new Date(startDate + "T00:00:00").toISOString(),
        endDate: new Date(endDate + "T23:59:59.999").toISOString(),
        chargeableFilters: selectedFilters.length > 0 ? selectedFilters : undefined,
        emails: emails && emails.length > 0 ? emails : undefined,
      });

      if (!result.success || !result.data) {
        set({ error: result.error || "Error al generar el reporte" });
        return;
      }

      const classified = classifyResponse(result.data);
      set({
        reportData: classified.reportData,
        sentByEmailData: classified.sentByEmailData,
        requiresEmailData: classified.requiresEmailData,
        responseType: classified.type,
      });
    } catch {
      set({ error: "Error de conexión" });
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    const range = getDefaultDateRange();
    set({
      startDate: range.startDate,
      endDate: range.endDate,
      selectedFilters: [],
      reportData: null,
      sentByEmailData: null,
      requiresEmailData: null,
      responseType: null,
      error: null,
    });
  },
}));
