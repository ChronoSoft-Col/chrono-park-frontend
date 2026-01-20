"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IValidateAmountParamsEntity, IValidateAmountResponseEntity } from "@/server/domain";
import { validateFeeAction } from "@/src/app/parking/cobro/actions/validate-fee.action";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

type TPaymentContext = {
  // raw action response (IGeneralResponse<IAmountDetailEntity>) wrapped by IActionResponse
  validateRaw: IValidateAmountResponseEntity | null;
  isValidating: boolean;
  validateFee: (params: IValidateAmountParamsEntity) => Promise<boolean>;
  clearValidateResult: () => void;
};

const PaymentContext = createContext<TPaymentContext | undefined>(undefined);

export const usePaymentContext = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePaymentContext must be used within PaymentProvider");
  return ctx;
};

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [validateRaw, setValidateRaw] = useState<IValidateAmountResponseEntity | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const pathname = usePathname();

  const validateFee = useCallback(async (params: IValidateAmountParamsEntity) => {
    setIsValidating(true);
    try {
      const res = await validateFeeAction(params);
      if (!res.success) {
        setValidateRaw(null);
        console.error("validateFee error:", res);
        toast.error(`Error validando los datos: ${res.error}`);
        return false;
      }
      // res.data is IGeneralResponse<IAmountDetailEntity>
      setValidateRaw(res.data ?? null);

      const vehiclePlate = res.data?.data?.vehicle?.licensePlate?.trim?.() ?? "";
      const providedPlate = params.licensePlate?.trim?.() ?? "";
      const providedQr = params.parkingSessionId?.trim?.() ?? "";

      if (!vehiclePlate && providedQr && !providedPlate) {
        toast.warning("La sesión no tiene placa registrada", {
          description: "Ingresa la placa y se validará de nuevo con QR + placa.",
        });
      } else {
        toast.success("Datos validados correctamente");
      }
      return true;
    } catch (error) {
      setValidateRaw(null);
      console.error("validateFee error:", error);
      toast.error(`Error validando los datos: ${error}`);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidateResult = useCallback(() => setValidateRaw(null), []);

  useEffect(() => {
    setValidateRaw(null);
  }, [pathname]);

  // THE IDEA IS THAT WE WILL HAVE ANOTHER PROP WITH THE PAYMENT DATA LIKE MONEY RECEIVED, CHANGE, ETC.
  const value: TPaymentContext = {
    validateRaw,
    isValidating,
    validateFee,
    clearValidateResult,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
