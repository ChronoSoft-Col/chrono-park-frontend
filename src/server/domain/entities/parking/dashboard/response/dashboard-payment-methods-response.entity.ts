import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardPaymentMethodItem {
  method: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface IDashboardPaymentMethodsData {
  data: IDashboardPaymentMethodItem[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardPaymentMethodsResponse extends IGeneralResponse<IDashboardPaymentMethodsData> {}
