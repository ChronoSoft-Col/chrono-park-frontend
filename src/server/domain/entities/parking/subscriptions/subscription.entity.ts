export type SubscriptionStatus = "ACTIVA" | "PERIODO_GRACIA" | "INACTIVA" | "CANCELADA";

export interface ISubscriptionEntity {
  id: string;
  agreementCode?: string;
  customer: {
    id: string;
    fullName: string;
    documentNumber: string;
    email: string;
  };
  vehicle: {
    id: string;
    licensePlate: string;
    type: string;
  };
  rateProfile: {
    id: string;
    name: string;
  };
  startDate: Date | string;
  endDate: Date | string;
  status: SubscriptionStatus;
}

export interface ISubscriptionHistoryPayment {
  id: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  amount: number;
  paymentId?: string;
  description: string;
  paymentDate?: Date | string;
  status: string;
}

export interface ISubscriptionHistoryEntity {
  id: string;
  agreementCode?: string;
  vehicle: {
    id: string;
    licensePlate: string;
    vehicleType: string;
  };
  status: SubscriptionStatus;
  startDate: Date | string;
  endDate: Date | string;
  history: ISubscriptionHistoryPayment[];
}
