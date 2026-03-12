export interface IPaymentDetailReport {
  concept: string;
  amount: number;
}

export interface IPaymentReportItem {
  index: number;
  consecutive: string;
  total: number;
  totalFormatted: string;
  date: string;
  dateFormatted: string;
  paymentMethod: string;
  notes: string | null;
  details: IPaymentDetailReport[];
}

export interface IPaymentsReportData {
  totalPayments: number;
  totalAmount: number;
  totalAmountFormatted: string;
  payments: IPaymentReportItem[];
}

export interface IReportSentByEmailData {
  sentByEmail: boolean;
  recipients: string[];
  dueToTimeout?: boolean;
}

export interface IReportRequiresEmailData {
  requiresEmail: boolean;
  message: string;
}

export type TPaymentsReportResponse =
  | IPaymentsReportData
  | IReportSentByEmailData
  | IReportRequiresEmailData;
