import { IRuleAppliedEntity } from "./rule-applied.entity";

export interface IAmountDetailEntity {
    parkingSessionId: string;
    entryTime: string;
    exitTime: string;
    durationMinutes: number;
    durationFormatted: string;
    calculatedAmount: number;
    discountPercentage: number | null;
    finalAmount: number;
    rateProfileName: string;
    agreementName: string;
    appliedRules: IRuleAppliedEntity[];
    gracePeriodMinutes: number;
}