import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardDayStats {
  entries: number;
  exits: number;
  revenue: number;
}

export interface IDashboardDailyComparisonData {
  today: IDashboardDayStats;
  yesterday: IDashboardDayStats;
  lastWeekSameDay: IDashboardDayStats;
  lastMonthSameDay: IDashboardDayStats;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardDailyComparisonResponse extends IGeneralResponse<IDashboardDailyComparisonData> {}
