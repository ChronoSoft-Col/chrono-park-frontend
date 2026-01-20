import { TPaymentMethods } from "./payment-methods.type";
import { TVehicleType } from "./vehicle-types.type";
import { TDocumentType } from "./document-types.type";

export type TCommonContextType = {
  vehicleTypes: TVehicleType[];
  paymentMethods: TPaymentMethods[];
  documentTypes: TDocumentType[];
};