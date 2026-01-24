import type IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export type IPaymentTicketHeaderEntity = {
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  paymentPoint: string;
  status: string;
};

export type IPaymentTicketDetailEntity = {
  type: string;
  description: string;
  licensePlate: string;
  entryTime: string;
  exitTime: string;
  duration: string;
  subtotal: string;
  tax: string;
};

export type IPaymentTicketTotalEntity = {
  subtotal: string;
  taxAmount: string;
  taxPercent: string;
  total: string;
  amountReceived?: string;
  change?: string;
};

export type ICompanyInfoEntity = {
  name: string;
  taxId: string;
  address: string;
};

export type IPrintPaymentTicketContentEntity = {
  company: ICompanyInfoEntity;
  headerMessage?: string;
  header: IPaymentTicketHeaderEntity;
  details: IPaymentTicketDetailEntity[];
  totals: IPaymentTicketTotalEntity;
  bodyMessage?: string;
  insurancePolicyInfo?: string;
  footerMessage?: string;
  notes?: string | null;
};

// Response wrapper as returned by our backend (CustomResponse)
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IPrintPaymentTicketResponseEntity extends IGeneralResponse<IPrintPaymentTicketContentEntity> {}
