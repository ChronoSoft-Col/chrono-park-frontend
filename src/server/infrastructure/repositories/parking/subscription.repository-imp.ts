import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
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
} from "@/server/domain";
import IGeneralResponse from "@/shared/interfaces/generic/general-response.interface";

@injectable()
export class SubscriptionRepositoryImp implements SubscriptionRepository {
  constructor(
    @inject(SERVER_TOKENS.SubscriptionDatasourceService)
    private readonly datasource: SubscriptionRepository
  ) {}

  listSubscriptions(
    params: IListSubscriptionsParamsEntity
  ): Promise<IListSubscriptionsResponseEntity> {
    return this.datasource.listSubscriptions(params);
  }

  getSubscriptionById(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.datasource.getSubscriptionById(id);
  }

  getSubscriptionsByCustomer(
    customerId: string
  ): Promise<IGeneralResponse<ISubscriptionEntity, false>> {
    return this.datasource.getSubscriptionsByCustomer(customerId);
  }

  createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.datasource.createSubscription(params);
  }

  paySubscription(
    id: string,
    params: IPaySubscriptionParamsEntity
  ): Promise<IGeneralResponse<{
    subscription: ISubscriptionEntity;
    calculation: IPriceCalculation;
    paymentId: string;
  }>> {
    return this.datasource.paySubscription(id, params);
  }

  cancelSubscription(
    id: string,
    params: ICancelSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.datasource.cancelSubscription(id, params);
  }

  getPaymentHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionPayment, false>> {
    return this.datasource.getPaymentHistory(id);
  }

  getStatusHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionStatusLog, false>> {
    return this.datasource.getStatusHistory(id);
  }

  calculatePrice(
    id: string,
    monthsCount?: number
  ): Promise<IGeneralResponse<IPriceCalculation>> {
    return this.datasource.calculatePrice(id, monthsCount);
  }

  listMonthlyPlans(
    onlyActive?: boolean
  ): Promise<IGeneralResponse<{ plans: IMonthlyPlanEntity[]; total: number }>> {
    return this.datasource.listMonthlyPlans(onlyActive);
  }

  getMonthlyPlansByVehicleType(
    vehicleTypeId: string,
    onlyActive?: boolean
  ): Promise<IGeneralResponse<IMonthlyPlanEntity, false>> {
    return this.datasource.getMonthlyPlansByVehicleType(vehicleTypeId, onlyActive);
  }

  getBillingConfig(): Promise<IGeneralResponse<IBillingConfig | null>> {
    return this.datasource.getBillingConfig();
  }

  updateBillingConfig(
    params: IUpdateBillingConfigParamsEntity
  ): Promise<IGeneralResponse<IBillingConfig>> {
    return this.datasource.updateBillingConfig(params);
  }
}
