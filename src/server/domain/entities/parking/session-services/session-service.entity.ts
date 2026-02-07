export interface ISessionServiceEntity {
  id: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes: string | null;
  createdAt: Date;
}

export interface ISessionServicesResponseEntity {
  services: ISessionServiceEntity[];
  total: number;
}
