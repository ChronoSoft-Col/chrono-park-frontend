"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IValidateAmountParamsEntity, IValidateAmountResponseEntity } from "@/server/domain";
import { validateFeeAction } from "@/src/app/parking/cobro/actions/validate-fee.action";
import { getRateProfileAction } from "@/src/app/global-actions/get-common.action";
import { TRateProfile } from "@/shared/types/common/rate-profile.type";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

type TPaymentContext = {
  // raw action response (IGeneralResponse<IAmountDetailEntity>) wrapped by IActionResponse
  validateRaw: IValidateAmountResponseEntity | null;
  isValidating: boolean;
  validateFee: (params: IValidateAmountParamsEntity) => Promise<boolean>;
  clearValidateResult: () => void;
  // Rate profile and vehicle type change
  availableRates: TRateProfile[];
  isLoadingRates: boolean;
  loadRatesForVehicleType: (vehicleTypeId: string) => Promise<void>;
  recalculateWithRate: (rateId: string) => Promise<boolean>;
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
  const [availableRates, setAvailableRates] = useState<TRateProfile[]>([]);
  const [isLoadingRates, setIsLoadingRates] = useState(false);
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

      const vehiclePlate = res.data?.data?.vehicle?.licensePlate?.trim?.() ?? "";
      const providedPlate = params.licensePlate?.trim?.() ?? "";
      const providedQr = params.parkingSessionId?.trim?.() ?? "";

      // If backend doesn't provide vehicle info, don't set validated state.
      // This forces the user to enter the plate and revalidate to continue.
      if (!vehiclePlate) {
        setValidateRaw(null);

        if (providedQr && !providedPlate) {
          toast.warning("La sesión no tiene placa registrada", {
            description: "Ingresa la placa para validar de nuevo y continuar.",
          });
        } else {
          toast.error("No se pudo validar el vehículo", {
            description: "Verifica la placa y vuelve a intentar.",
          });
        }

        return false;
      }

      // res.data is IGeneralResponse<IAmountDetailEntity>
      setValidateRaw(res.data ?? null);
      toast.success("Datos validados correctamente");
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

  const clearValidateResult = useCallback(() => {
    setValidateRaw(null);
    setAvailableRates([]);
  }, []);

  const loadRatesForVehicleType = useCallback(async (vehicleTypeId: string) => {
    if (!vehicleTypeId) return;
    setIsLoadingRates(true);
    try {
      const res = await getRateProfileAction(vehicleTypeId);
      if (res.success && res.data?.data) {
        // data can be array or single object depending on backend
        const rates = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setAvailableRates(rates.filter((r) => r.isActive));
      } else {
        setAvailableRates([]);
      }
    } catch (error) {
      console.error("loadRatesForVehicleType error:", error);
      setAvailableRates([]);
    } finally {
      setIsLoadingRates(false);
    }
  }, []);

  const recalculateWithRate = useCallback(async (rateId: string) => {
    if (!validateRaw?.data) return false;

    const currentData = validateRaw.data;
    const params: IValidateAmountParamsEntity = {
      parkingSessionId: currentData.parkingSessionId,
      licensePlate: currentData.vehicle?.licensePlate,
      exitTime: new Date(currentData.exitTime),
      rateId,
    };

    return validateFee(params);
  }, [validateRaw, validateFee]);

  useEffect(() => {
    setValidateRaw(null);
    setAvailableRates([]);
  }, [pathname]);

  // THE IDEA IS THAT WE WILL HAVE ANOTHER PROP WITH THE PAYMENT DATA LIKE MONEY RECEIVED, CHANGE, ETC.
  const value: TPaymentContext = {
    validateRaw,
    isValidating,
    validateFee,
    clearValidateResult,
    availableRates,
    isLoadingRates,
    loadRatesForVehicleType,
    recalculateWithRate,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
