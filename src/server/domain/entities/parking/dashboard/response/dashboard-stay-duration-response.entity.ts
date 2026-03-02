import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardStayDurationBucket {
  range: string;
  count: number;
  percentage: number;
}

export interface IDashboardStayDurationData {
  averageMinutes: number;
  distribution: IDashboardStayDurationBucket[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardStayDurationResponse extends IGeneralResponse<IDashboardStayDurationData> {}
