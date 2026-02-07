import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
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
  SubscriptionRepository,
} from "@/server/domain/index";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

@injectable()
export class SubscriptionDatasourceService
  extends AxiosServerInstance
  implements SubscriptionRepository
{
  // ================================
  // Suscripciones
  // ================================

  async listSubscriptions(
    params: IListSubscriptionsParamsEntity
  ): Promise<IListSubscriptionsResponseEntity> {
    return this.api
      .get<IListSubscriptionsResponseEntity>("/subscriptions", { params })
      .then((response) => response.data);
  }

  async getSubscriptionById(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.api
      .get<IGeneralResponse<ISubscriptionEntity>>(`/subscriptions/${id}`)
      .then((response) => response.data);
  }

  async getSubscriptionsByCustomer(
    customerId: string
  ): Promise<IGeneralResponse<ISubscriptionEntity, false>> {
    return this.api
      .get<IGeneralResponse<ISubscriptionEntity, false>>(
        `/subscriptions/customer/${customerId}`
      )
      .then((response) => response.data);
  }

  async createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.api
      .post<IGeneralResponse<ISubscriptionEntity>>("/subscriptions", params)
      .then((response) => response.data);
  }

  async paySubscription(
    id: string,
    params: IPaySubscriptionParamsEntity
  ): Promise<IGeneralResponse<{
    subscription: ISubscriptionEntity;
    calculation: IPriceCalculation;
    paymentId: string;
  }>> {
    return this.api
      .post<IGeneralResponse<{
        subscription: ISubscriptionEntity;
        calculation: IPriceCalculation;
        paymentId: string;
      }>>(`/subscriptions/${id}/pay`, params)
      .then((response) => response.data);
  }

  async cancelSubscription(
    id: string,
    params: ICancelSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.api
      .post<IGeneralResponse<ISubscriptionEntity>>(
        `/subscriptions/${id}/cancel`,
        params
      )
      .then((response) => response.data);
  }

  async getPaymentHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionPayment, false>> {
    return this.api
      .get<IGeneralResponse<ISubscriptionPayment, false>>(
        `/subscriptions/${id}/payments`
      )
      .then((response) => response.data);
  }

  async getStatusHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionStatusLog, false>> {
    return this.api
      .get<IGeneralResponse<ISubscriptionStatusLog, false>>(
        `/subscriptions/${id}/status-history`
      )
      .then((response) => response.data);
  }

  async calculatePrice(
    id: string,
    monthsCount?: number
  ): Promise<IGeneralResponse<IPriceCalculation>> {
    const params = monthsCount ? { monthsCount } : {};
    return this.api
      .get<IGeneralResponse<IPriceCalculation>>(
        `/subscriptions/${id}/calculate-price`,
        { params }
      )
      .then((response) => response.data);
  }

  // ================================
  // Planes mensuales
  // ================================

  async listMonthlyPlans(
    onlyActive?: boolean
  ): Promise<IGeneralResponse<{ plans: IMonthlyPlanEntity[]; total: number }>> {
    const params = onlyActive !== undefined ? { onlyActive } : {};
    return this.api
      .get<IGeneralResponse<{ plans: IMonthlyPlanEntity[]; total: number }>>(
        "/monthly-plans",
        { params }
      )
      .then((response) => response.data);
  }

  async getMonthlyPlansByVehicleType(
    vehicleTypeId: string,
    onlyActive?: boolean
  ): Promise<IGeneralResponse<IMonthlyPlanEntity, false>> {
    const params = onlyActive !== undefined ? { onlyActive } : {};
    return this.api
      .get<IGeneralResponse<IMonthlyPlanEntity, false>>(
        `/monthly-plans/vehicle-type/${vehicleTypeId}`,
        { params }
      )
      .then((response) => response.data);
  }

  // ================================
  // Configuración de facturación
  // ================================

  async getBillingConfig(): Promise<IGeneralResponse<IBillingConfig | null>> {
    return this.api
      .get<IGeneralResponse<IBillingConfig | null>>("/subscriptions/config/billing")
      .then((response) => response.data);
  }

  async updateBillingConfig(
    params: IUpdateBillingConfigParamsEntity
  ): Promise<IGeneralResponse<IBillingConfig>> {
    return this.api
      .post<IGeneralResponse<IBillingConfig>>("/subscriptions/config/billing", params)
      .then((response) => response.data);
  }
}
