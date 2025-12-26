import { useEffect, useState } from "react";
import { TCommonContextType } from "../../types/common/common-context.type";
import { getCommonAction } from "@/src/app/global-actions/get-common.action";
import { EServices } from "../../enums/common/services.enum";
import { TVehicleType } from "../../types/common/vehicle-types.type";
import { TPaymentMethods } from "../../types/common/payment-methods.type";

export default function UseCommon() {
  const [commonData, setCommonData] = useState<TCommonContextType | undefined>(
    undefined
  );

  const getData = async () => {
    await Promise.all([
      getCommonAction<TVehicleType[]>(EServices.VEHICLE_TYPES),
      getCommonAction<TPaymentMethods[]>(EServices.PAYMENT_METHODS),
    ]).then(([vehicleTypes, paymentMethods]) => {
      setCommonData({
        vehicleTypes: vehicleTypes.data?.data || [],
        paymentMethods: paymentMethods.data?.data || [],
      });
    })
  };

  useEffect(() => {
    getData();
  }, []);

  return { commonData, setCommonData };
}
