import IIdName from "@/src/shared/interfaces/generic/id-name.interface";
import { IRuleAppliedEntity } from "./rule-applied.entity";
import { ServiceStatusEnum } from "@/src/shared/enums/parking/service-status.enum";

/** Detalle de servicio adicional en la respuesta de calculate-fee */
export interface IAmountAdditionalServiceDetail {
    /** ID del registro del servicio en la sesión */
    id: string;
    /** ID del servicio adicional (catálogo) */
    additionalServiceId: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    /** Estado del servicio: PENDING | PAID | CANCELLED */
    status: ServiceStatusEnum;
    /** Si el precio incluye impuestos */
    taxIncluded: boolean;
    /** Porcentaje de impuesto (ej: 19) */
    taxPercent: number;
}

export interface IAmountDetailEntity {
    parkingSessionId: string;
    entryTime: string;
    exitTime: string;
    durationMinutes: number;
    durationFormatted: string;
    calculatedAmount: number;
    discountPercentage: number | null;
    finalAmount: number;
    rateProfileName: string;
    agreementName: string;
    appliedRules: IRuleAppliedEntity[];
    gracePeriodMinutes: number;

    billedMinutes: number;

    vehicle: {
        id: string;
        licensePlate: string;
        vehicleType: IIdName;
    };

    /** Servicios adicionales agregados a la sesión */
    additionalServices: IAmountAdditionalServiceDetail[];
    /** Total de servicios adicionales */
    additionalServicesTotal: number;
}