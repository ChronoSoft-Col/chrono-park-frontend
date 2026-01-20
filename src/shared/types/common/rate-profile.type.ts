import IIdName from "../../interfaces/generic/id-name.interface";

export type TRateProfile = {
  description: string;
  priority: number;
  vehicleTypeId: string;
  vehicleType: IIdName;
  maxDailyAmount: number;
  gracePeriodMinutes: number;
  isActive: boolean;
  createdAt: string;
  rules: TRateProfileRule[];
  rulesCount: number;
  sessionsCount: number;

} & IIdName;

export type TRateProfileRule = {
      id: string;
    rateProfileId: string;
    ruleType: "FLAT_FEE" | "HOURLY_RATE" | "DAILY_RATE" | "PERIODIC_RATE";
    fixedAmount?: number;
    hourlyRate?: number;
    firstHourRate?: number;
    subsequentRate?: number;
    freeMinutes?: number;
    startTime?: string;
    endTime?: string;
    daysOfWeek?: string;
    minDuration?: number;
    maxDuration?: number;
    periodDuration?: number;
    marginMinutes?: number;
    discountPercent?: number;
    minOccupancy?: number;
    maxOccupancy?: number;
    applyOrder: number;
    isActive: boolean;
    createdAt: string;
}