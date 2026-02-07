import { SubscriptionStatus } from "../subscription.entity";

export interface IListSubscriptionsParamsEntity {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: SubscriptionStatus;
}
