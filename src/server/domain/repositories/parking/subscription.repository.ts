import {
  IListSubscriptionsParamsEntity,
  IListSubscriptionsResponseEntity,
  ICreateSubscriptionParamsEntity,
  IGetSubscriptionHistoryResponseEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class SubscriptionRepository {
  abstract listSubscriptions(
    params: IListSubscriptionsParamsEntity
  ): Promise<IListSubscriptionsResponseEntity>;

  abstract createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IEmptyResponse>;

  abstract getCustomerSubscriptionHistory(
    customerId: string
  ): Promise<IGetSubscriptionHistoryResponseEntity>;
}
