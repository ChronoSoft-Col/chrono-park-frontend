import { useEffect, useState } from "react";
import { TCommonContextType } from "../../types/common/common-context.type";
import { getCommonAction } from "@/src/app/global-actions/get-common.action";
import { EServices } from "../../enums/common/services.enum";
import { TVehicleType } from "../../types/common/vehicle-types.type";
import { TPaymentMethods } from "../../types/common/payment-methods.type";
import { TDocumentType } from "../../types/common/document-types.type";

export default function UseCommon() {
  const [commonData, setCommonData] = useState<TCommonContextType | undefined>(
    undefined
  );

  const getData = async () => {
    try {
      const [vehicleTypes, paymentMethods, documentTypes] = await Promise.all([
        getCommonAction<TVehicleType[]>(EServices.VEHICLE_TYPES),
        getCommonAction<TPaymentMethods[]>(EServices.PAYMENT_METHODS),
        getCommonAction<TDocumentType[]>(EServices.DOCUMENT_TYPES),
      ]);
      
      console.log("Common data loaded:", { vehicleTypes, paymentMethods, documentTypes });
      
      setCommonData({
        vehicleTypes: vehicleTypes.data?.data || [],
        paymentMethods: paymentMethods.data?.data || [],
        documentTypes: documentTypes.data?.data || [],
      });
    } catch (error) {
      console.error("Error loading common data:", error);
      // Set empty arrays to prevent indefinite loading
      setCommonData({
        vehicleTypes: [],
        paymentMethods: [],
        documentTypes: [],
      });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return { commonData, setCommonData };
}
