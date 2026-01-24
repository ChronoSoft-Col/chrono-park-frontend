import { ICustomerEntity } from "../customer.entity";

export type IUpdateCustomerParamsEntity = Partial<
  Pick<ICustomerEntity, "firstName" | "lastName" | "email" | "phoneNumber" | "agreementId" | "isActive">
>;
