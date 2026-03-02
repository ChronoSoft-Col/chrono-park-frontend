import { IDashboardDateRangeParams } from "./dashboard-date-range-params.entity";

export type TDashboardGroupBy = "hour" | "day" | "week" | "month";

export interface IDashboardGroupedParams extends IDashboardDateRangeParams {
  groupBy: TDashboardGroupBy;
}
