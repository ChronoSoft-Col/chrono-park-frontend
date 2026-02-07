import { ISubscriptionEntity } from "../subscription.entity";

export interface IGetSubscriptionHistoryResponseEntity {
  success: boolean;
  data: ISubscriptionEntity[];
  message?: string;
}
