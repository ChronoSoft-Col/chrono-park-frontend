import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
  IListSubscriptionsParamsEntity,
  IListSubscriptionsResponseEntity,
  ICreateSubscriptionParamsEntity,
  IGetSubscriptionHistoryResponseEntity,
  SubscriptionRepository,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

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

  createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IEmptyResponse> {
    return this.subscriptionRepository.createSubscription(params);
  }

  getCustomerSubscriptionHistory(
    customerId: string
  ): Promise<IGetSubscriptionHistoryResponseEntity> {
    return this.subscriptionRepository.getCustomerSubscriptionHistory(customerId);
  }
}
