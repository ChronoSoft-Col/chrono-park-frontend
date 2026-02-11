import { ServiceStatusEnum } from "@/src/shared/enums/parking/service-status.enum";

export interface ISessionServiceEntity {
  id: string;
  /** ID del servicio adicional en el catálogo */
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
  notes: string | null;
  createdAt: Date;
}

export interface ISessionServicesResponseEntity {
  services: ISessionServiceEntity[];
  total: number;
}
