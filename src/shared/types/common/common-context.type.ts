import { TPaymentMethods } from "./payment-methods.type";
import { TVehicleType } from "./vehicle-types.type";
import { TDocumentType } from "./document-types.type";
import { TAdditionalService } from "./additional-service.type";

export type TCommonContextType = {
  vehicleTypes: TVehicleType[];
  paymentMethods: TPaymentMethods[];
  documentTypes: TDocumentType[];
  additionalServices: TAdditionalService[];
};