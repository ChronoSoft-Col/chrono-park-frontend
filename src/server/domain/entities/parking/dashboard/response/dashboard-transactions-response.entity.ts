import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardTransactionDataPoint {
  date: string;
  count: number;
  revenue: number;
}

export interface IDashboardTransactionTotals {
  count: number;
  revenue: number;
}

export interface IDashboardTransactionsData {
  period: { start: string; end: string };
  data: IDashboardTransactionDataPoint[];
  totals: IDashboardTransactionTotals;
  averageTicket: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardTransactionsResponse extends IGeneralResponse<IDashboardTransactionsData> {}
