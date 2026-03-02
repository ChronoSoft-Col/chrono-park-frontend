import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardRevenueByVehicleItem {
  vehicleType: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface IDashboardRevenueByVehicleTotals {
  count: number;
  revenue: number;
}

export interface IDashboardRevenueByVehicleData {
  data: IDashboardRevenueByVehicleItem[];
  totals: IDashboardRevenueByVehicleTotals;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardRevenueByVehicleResponse extends IGeneralResponse<IDashboardRevenueByVehicleData> {}
