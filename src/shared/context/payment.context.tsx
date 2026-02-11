"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { IValidateAmountParamsEntity, IValidateAmountResponseEntity, ISessionServiceEntity } from "@/server/domain";
import { validateFeeAction } from "@/src/app/parking/cobro/actions/validate-fee.action";
import { listSessionServicesAction } from "@/src/app/parking/cobro/actions/list-session-services.action";
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
  // Session services
  sessionServices: ISessionServiceEntity[];
  sessionServicesTotal: number;
  isLoadingServices: boolean;
  loadSessionServices: () => Promise<void>;
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
  const [sessionServices, setSessionServices] = useState<ISessionServiceEntity[]>([]);
  const [sessionServicesTotal, setSessionServicesTotal] = useState(0);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const pathname = usePathname();

  const loadSessionServices = useCallback(async () => {
    const sessionId = validateRaw?.data?.parkingSessionId;
    if (!sessionId) return;

    setIsLoadingServices(true);
    try {
      const res = await listSessionServicesAction(sessionId);
      if (res.success && res.data) {
        setSessionServices(res.data.services ?? []);
        setSessionServicesTotal(res.data.total ?? 0);
      }
    } catch (error) {
      console.error("Error loading session services:", error);
    } finally {
      setIsLoadingServices(false);
    }
  }, [validateRaw?.data?.parkingSessionId]);

  const validateFee = useCallback(async (params: IValidateAmountParamsEntity) => {
    setIsValidating(true);
    const toastId = toast.loading("Validando tarifa...");
    try {
      const res = await validateFeeAction(params);
      if (!res.success) {
        setValidateRaw(null);
        toast.error(`Error validando los datos: ${res.error}`, { id: toastId });
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
            id: toastId,
            description: "Ingresa la placa para validar de nuevo y continuar.",
          });
        } else {
          toast.error("No se pudo validar el vehículo", {
            id: toastId,
            description: "Verifica la placa y vuelve a intentar.",
          });
        }

        return false;
      }

      // res.data is IGeneralResponse<IAmountDetailEntity>
      setValidateRaw(res.data ?? null);
      toast.success("Datos validados correctamente", { id: toastId });
      return true;
    } catch (error) {
      setValidateRaw(null);
      toast.error(`Error validando los datos: ${error}`, { id: toastId });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidateResult = useCallback(() => {
    setValidateRaw(null);
    setAvailableRates([]);
    setSessionServices([]);
    setSessionServicesTotal(0);
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
    setSessionServices([]);
    setSessionServicesTotal(0);
  }, [pathname]);

  // Load services when session changes
  useEffect(() => {
    if (validateRaw?.data?.parkingSessionId) {
      loadSessionServices();
    }
  }, [validateRaw?.data?.parkingSessionId, loadSessionServices]);

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
    sessionServices,
    sessionServicesTotal,
    isLoadingServices,
    loadSessionServices,
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
