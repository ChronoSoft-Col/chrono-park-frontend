import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardOccupancy {
  total: number | null;
  occupied: number;
  available: number | null;
  percentage: number | null;
}

export interface IDashboardTodayStats {
  entries: number;
  exits: number;
  activeVehicles: number;
  revenue: number;
}

export interface IDashboardComparison {
  entriesChange: number;
  revenueChange: number;
}

export interface IDashboardOverviewData {
  occupancy: IDashboardOccupancy;
  todayStats: IDashboardTodayStats;
  comparison: IDashboardComparison;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardOverviewResponse extends IGeneralResponse<IDashboardOverviewData> {}
