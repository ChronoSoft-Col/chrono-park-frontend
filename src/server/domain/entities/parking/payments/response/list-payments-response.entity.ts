import type IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import type { IPaymentItemEntity } from "./payment-list-item.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListPaymentsResponseEntity extends IGeneralResponse<IPaymentItemEntity, true> {}
