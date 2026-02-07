import { IPriceCalculation, IBillingConfig, ISubscriptionEntity } from "../subscription.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

// Respuesta del cálculo de precio
export type IPriceCalculationResponseEntity = IGeneralResponse<IPriceCalculation>;

// Respuesta de configuración de facturación
export type IBillingConfigResponseEntity = IGeneralResponse<IBillingConfig>;

// Respuesta de pago de suscripción
export interface IPaySubscriptionResult {
  subscription: ISubscriptionEntity;
  calculation: IPriceCalculation;
  paymentId: string;
}

export type IPaySubscriptionResponseEntity = IGeneralResponse<IPaySubscriptionResult>;
