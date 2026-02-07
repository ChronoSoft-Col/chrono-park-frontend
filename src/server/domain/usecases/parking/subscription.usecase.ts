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
export class SubscriptionUsecase implements SubscriptionRepository {
  constructor(
    @inject(SERVER_TOKENS.SubscriptionRepository)
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}

  listSubscriptions(
    params: IListSubscriptionsParamsEntity
  ): Promise<IListSubscriptionsResponseEntity> {
    return this.subscriptionRepository.listSubscriptions(params);
  }

  getSubscriptionById(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.subscriptionRepository.getSubscriptionById(id);
  }

  getSubscriptionsByCustomer(
    customerId: string
  ): Promise<IGeneralResponse<ISubscriptionEntity, false>> {
    return this.subscriptionRepository.getSubscriptionsByCustomer(customerId);
  }

  createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.subscriptionRepository.createSubscription(params);
  }

  paySubscription(
    id: string,
    params: IPaySubscriptionParamsEntity
  ): Promise<IGeneralResponse<{
    subscription: ISubscriptionEntity;
    calculation: IPriceCalculation;
    paymentId: string;
  }>> {
    return this.subscriptionRepository.paySubscription(id, params);
  }

  cancelSubscription(
    id: string,
    params: ICancelSubscriptionParamsEntity
  ): Promise<IGeneralResponse<ISubscriptionEntity>> {
    return this.subscriptionRepository.cancelSubscription(id, params);
  }

  getPaymentHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionPayment, false>> {
    return this.subscriptionRepository.getPaymentHistory(id);
  }

  getStatusHistory(
    id: string
  ): Promise<IGeneralResponse<ISubscriptionStatusLog, false>> {
    return this.subscriptionRepository.getStatusHistory(id);
  }

  calculatePrice(
    id: string,
    monthsCount?: number
  ): Promise<IGeneralResponse<IPriceCalculation>> {
    return this.subscriptionRepository.calculatePrice(id, monthsCount);
  }

  listMonthlyPlans(
    onlyActive?: boolean
  ): Promise<IGeneralResponse<{ plans: IMonthlyPlanEntity[]; total: number }>> {
    return this.subscriptionRepository.listMonthlyPlans(onlyActive);
  }

  getMonthlyPlansByVehicleType(
    vehicleTypeId: string,
    onlyActive?: boolean
  ): Promise<IGeneralResponse<IMonthlyPlanEntity, false>> {
    return this.subscriptionRepository.getMonthlyPlansByVehicleType(vehicleTypeId, onlyActive);
  }

  getBillingConfig(): Promise<IGeneralResponse<IBillingConfig | null>> {
    return this.subscriptionRepository.getBillingConfig();
  }

  updateBillingConfig(
    params: IUpdateBillingConfigParamsEntity
  ): Promise<IGeneralResponse<IBillingConfig>> {
    return this.subscriptionRepository.updateBillingConfig(params);
  }
}
