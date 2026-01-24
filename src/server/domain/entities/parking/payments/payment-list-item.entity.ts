export type PaymentStatus = string;

export type IPaymentMethodSummaryEntity = {
  id: string;
  name: string;
};

export type IPaymentPointSummaryEntity = {
  id: string;
  name: string;
};

export type IClosureSummaryEntity = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
};

export type IParkingSessionReferenceEntity = {
  id: string;
  licensePlate: string;
  entryTime: string;
  exitTime?: string | null;
};

export type IServiceReferenceEntity = {
  id: string;
  name: string;
};

export type IPaymentDetailItemEntity = {
  id: string;
  type: "PARKING" | "SERVICE";
  amount: number;
  taxableAmount: number;
  taxAmount: number;
  reference?: IParkingSessionReferenceEntity | IServiceReferenceEntity | null;
};

export type IPaymentItemEntity = {
  id: string;
  transactionId: string | null;
  totalAmount: number;
  taxableAmount: number;
  taxAmount: number;
  status: PaymentStatus;
  paymentDate: string;
  notes: string | null;
  paymentMethod: IPaymentMethodSummaryEntity;
  paymentPoint: IPaymentPointSummaryEntity;
  closure: IClosureSummaryEntity | null;
  details: IPaymentDetailItemEntity[];
  createdAt: string;
};
