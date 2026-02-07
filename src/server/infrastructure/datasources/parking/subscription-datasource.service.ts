import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import {
  IListSubscriptionsParamsEntity,
  IListSubscriptionsResponseEntity,
  ICreateSubscriptionParamsEntity,
  IGetSubscriptionHistoryResponseEntity,
  SubscriptionRepository,
} from "@/server/domain/index";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class SubscriptionDatasourceService
  extends AxiosServerInstance
  implements SubscriptionRepository
{
  async listSubscriptions(
    params: IListSubscriptionsParamsEntity
  ): Promise<IListSubscriptionsResponseEntity> {
    return this.api
      .get<IListSubscriptionsResponseEntity>("/billing/individual", { params })
      .then((response) => response.data);
  }

  async createSubscription(
    params: ICreateSubscriptionParamsEntity
  ): Promise<IEmptyResponse> {
    return this.api
      .post<IEmptyResponse>("/billing/individual", params)
      .then((response) => response.data);
  }

  async getCustomerSubscriptionHistory(
    customerId: string
  ): Promise<IGetSubscriptionHistoryResponseEntity> {
    return this.api
      .get<IGetSubscriptionHistoryResponseEntity>(
        `/billing/individual/customer/${customerId}/history`
      )
      .then((response) => response.data);
  }
}
