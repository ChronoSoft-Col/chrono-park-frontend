import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { TDashboardGroupBy } from "../params/dashboard-grouped-params.entity";

export interface IDashboardTrafficDataPoint {
  date: string;
  entries: number;
  exits: number;
}

export interface IDashboardTrafficTotals {
  entries: number;
  exits: number;
}

export interface IDashboardTrafficData {
  period: { start: string; end: string };
  groupBy: TDashboardGroupBy;
  data: IDashboardTrafficDataPoint[];
  totals: IDashboardTrafficTotals;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardTrafficResponse extends IGeneralResponse<IDashboardTrafficData> {}
