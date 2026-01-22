export interface IListPaymentsParamsEntity {
  page: number;
  limit: number;
  status?: string;
  paymentMethodId?: string;
  paymentPointId?: string;
  startDate?: string;
  endDate?: string;
  closureId?: string;
  hasNoClosure?: boolean;
  search?: string;
}
