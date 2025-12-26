import { TPaymentMethods } from "./payment-methods.type";
import { TVehicleType } from "./vehicle-types.type";

export type TCommonContextType = {
  vehicleTypes: TVehicleType[];
  paymentMethods: TPaymentMethods[];
};