// Nuevo estado PENDIENTE agregado
export type SubscriptionStatus = 
  | "PENDIENTE" 
  | "ACTIVA" 
  | "PERIODO_GRACIA" 
  | "INACTIVA" 
  | "CANCELADA";

export interface IMonthlyPlanEntity {
  id: string;
  name: string;
  description?: string | null;
  vehicleTypeId: string;
  price: number;
  isActive: boolean;
  createdAt?: Date | string;
  vehicleType?: {
    id: string;
    name: string;
  };
}

export interface ISubscriptionCustomer {
  id: string;
  firstName: string;
  lastName: string;
  documentNumber: string;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface ISubscriptionVehicle {
  id: string;
  plateNumber: string;
  vehicleTypeName?: string;
}

export interface ISubscriptionPayment {
  id: string;
  periodStart: Date | string;
  periodEnd: Date | string;
  monthsCount: number;
  amount: number;
  proratedDays?: number | null;
  proratedAmount?: number | null;
  createdAt: Date | string;
}

export interface ISubscriptionStatusLog {
  id: string;
  previousStatus?: string | null;
  newStatus: string;
  reason?: string | null;
  changedAt: Date | string;
}

export interface ISubscriptionEntity {
  id: string;
  customerId: string;
  monthlyPlanId: string;
  vehicleTypeId: string;
  vehicleId?: string | null;
  startDate: Date | string;
  endDate: Date | string;
  status: SubscriptionStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  customer?: ISubscriptionCustomer;
  monthlyPlan?: IMonthlyPlanEntity;
  vehicle?: ISubscriptionVehicle | null;
  payments?: ISubscriptionPayment[];
  statusHistory?: ISubscriptionStatusLog[];
}

export interface IPriceCalculation {
  planPrice: number;
  proratedDays?: number;
  proratedAmount?: number;
  fullMonthsCount: number;
  fullMonthsAmount: number;
  totalAmount: number;
  periodStart: Date | string;
  periodEnd: Date | string;
}

export interface IBillingConfig {
  id: string;
  cutoffDay?: number | null;
  graceDays: number;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

