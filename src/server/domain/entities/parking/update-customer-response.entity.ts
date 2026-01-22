import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import type { ICustomerEntity } from "./customer.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IUpdateCustomerResponseEntity extends IGeneralResponse<ICustomerEntity> {}
