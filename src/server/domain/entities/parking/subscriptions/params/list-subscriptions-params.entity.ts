import { SubscriptionStatus } from "../subscription.entity";

export interface IListSubscriptionsParamsEntity {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  vehicleTypeId?: string;
  monthlyPlanId?: string;
  status?: SubscriptionStatus;
}
