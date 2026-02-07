import {
  IListSubscriptionsParamsEntity,
  IListSubscriptionsResponseEntity,
  ICreateSubscriptionParamsEntity,
  IPaySubscriptionParamsEntity,
  ICancelSubscriptionParamsEntity,
  IUpdateBillingConfigParamsEntity,
  ISubscriptionEntity,
  IMonthlyPlanEntity,
  ISubscriptionPayment,
  ISubscriptionStatusLog,
  IPriceCalculation,
  IBillingConfig,
} from "@/server/domain";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export abstract class SubscriptionRepository {
  // Suscripciones
  abstract listSubscriptions(
    params: IListSubscriptionsParamsEntity
  ): Promise<IListSubscriptionsResponseEntity>;

  abstract getSubscriptionById(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionEntity>>;

  abstract getSubscriptionsByCustomer(
    customerId: string
  ): Promise<IGeneralResponse<ISubscriptionEntity, false>>;

  abstract createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>>;

  abstract paySubscription(
    id: string,
    params: IPaySubscriptionParamsEntity
  ): Promise<IGeneralResponse<{
    subscription: ISubscriptionEntity;
    calculation: IPriceCalculation;
    paymentId: string;
  }>>;

  abstract cancelSubscription(
    id: string,
    params: ICancelSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>>;

  abstract getPaymentHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionPayment, false>>;

  abstract getStatusHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionStatusLog, false>>;

  abstract calculatePrice(
    id: string,
    monthsCount?: number
  ): Promise<IGeneralResponse<IPriceCalculation>>;

  // Planes mensuales
  abstract listMonthlyPlans(
    onlyActive?: boolean
  ): Promise<IGeneralResponse<{ plans: IMonthlyPlanEntity[]; total: number }>>;

  abstract getMonthlyPlansByVehicleType(
    vehicleTypeId: string,
    onlyActive?: boolean
  ): Promise<IGeneralResponse<IMonthlyPlanEntity, false>>;

  // Configuración de facturación
  abstract getBillingConfig(): Promise<IGeneralResponse<IBillingConfig | null>>;

  abstract updateBillingConfig(
    params: IUpdateBillingConfigParamsEntity
  ): Promise<IGeneralResponse<IBillingConfig>>;
}
