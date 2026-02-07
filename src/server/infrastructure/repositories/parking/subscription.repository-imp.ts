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

  createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IEmptyResponse> {
    return this.datasource.createSubscription(params);
  }

  getCustomerSubscriptionHistory(
    customerId: string
  ): Promise<IGetSubscriptionHistoryResponseEntity> {
    return this.datasource.getCustomerSubscriptionHistory(customerId);
  }
}
