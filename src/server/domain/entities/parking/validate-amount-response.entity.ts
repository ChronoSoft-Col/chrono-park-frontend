import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IAmountDetailEntity } from "./amount-detail.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IValidateAmountResponseEntity extends IGeneralResponse<IAmountDetailEntity> {}
