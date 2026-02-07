// Nuevo formato simplificado para crear suscripción
export interface ICreateSubscriptionParamsEntity {
  customerId: string;
  monthlyPlanId: string;
  vehicleId?: string;
}

// Parámetros para pagar una suscripción
export interface IPaySubscriptionParamsEntity {
  monthsCount?: number;
  paymentMethodId: string;
  paymentPointId?: string;
  amountReceived?: number;
}

// Parámetros para cancelar una suscripción
export interface ICancelSubscriptionParamsEntity {
  reason?: string;
}

// Parámetros para actualizar configuración de facturación
export interface IUpdateBillingConfigParamsEntity {
  cutoffDay?: number | null;
  graceDays?: number;
}
