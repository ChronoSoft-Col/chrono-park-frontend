import { ISubscriptionEntity } from "../subscription.entity";
import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";

export type IListSubscriptionsResponseEntity = IGeneralResponse<ISubscriptionEntity, true>;
