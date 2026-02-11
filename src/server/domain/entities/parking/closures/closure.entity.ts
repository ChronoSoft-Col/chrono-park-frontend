import { ClosureTypeEnum } from "@/src/shared/enums/parking/closure-type.enum";

/** Resumen de un rubro agrupado con total y cantidad */
export type IClosureSummaryItem = {
  total: string;
  count: number;
};

export interface IClosureDetailEntity {
  detailId: string;
  closureRefId: string;
  summary: Record<string, unknown> | string;
  rateSummary: Record<string, unknown> | string | null;
  /** Ahora solo contiene { totalAmount: string } */
  paymentSummary: Record<string, unknown> | string | null;
  /** Resumen de servicios adicionales - NUEVO */
  additionalServiceSummary: Record<string, IClosureSummaryItem> | null;
  /** Resumen de suscripciones/mensualidades - NUEVO */
  subscriptionSummary: Record<string, IClosureSummaryItem> | null;
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
