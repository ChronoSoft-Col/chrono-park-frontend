import { ISubscriptionHistoryEntity } from "../subscription.entity";

export interface IGetSubscriptionHistoryResponseEntity {
  success: boolean;
  data: ISubscriptionHistoryEntity[];
  message?: string;
}
