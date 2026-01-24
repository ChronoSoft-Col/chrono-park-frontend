import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";

export interface IClosureDetailEntity {
  detailId: string;
  closureRefId: string;
  summary: Record<string, unknown> | string;
  rateSummary: Record<string, unknown> | string | null;
  paymentSummary: Record<string, unknown> | string | null;
  recordedAt: string;
}

export interface IClosureEntity {
  closureId: string;
  operatorId: string;
  paymentPointRef: string;
  startedAt: string;
  finishedAt: string;
  closureType: ClosureTypeEnum;
  totalCollected: string | null;
  remarks: string | null;
  createdOn: string;
  detail: IClosureDetailEntity | null;
}
