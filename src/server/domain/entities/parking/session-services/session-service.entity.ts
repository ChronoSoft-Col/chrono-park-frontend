export interface ISessionServiceEntity {
  id: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes: string | null;
  createdAt: Date;
  /** Campos opcionales - el backend puede no enviarlos */
  additionalServiceId?: string;
  status?: string;
  taxIncluded?: boolean;
  taxPercent?: number;
}

export interface ISessionServicesResponseEntity {
  services: ISessionServiceEntity[];
  total: number;
}
