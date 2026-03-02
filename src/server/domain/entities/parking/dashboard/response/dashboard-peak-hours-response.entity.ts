import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export interface IDashboardHourlyAverage {
  hour: number;
  avgOccupancy: number;
  avgEntries: number;
}

export interface IDashboardPeakHour {
  hour: number;
  avgOccupancy: number;
}

export interface IDashboardPeakHoursData {
  hourlyAverage: IDashboardHourlyAverage[];
  peakHour: IDashboardPeakHour;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IDashboardPeakHoursResponse extends IGeneralResponse<IDashboardPeakHoursData> {}
