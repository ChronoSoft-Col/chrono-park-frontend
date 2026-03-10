export interface IBlackListEntity {
  id: string;
  vehicleId: string;
  customerId?: string;
  reason: string;
  isActive: boolean;
  createdAt: string;
  vehicle?: {
    id: string;
    licensePlate: string;
  };
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
  };
}
