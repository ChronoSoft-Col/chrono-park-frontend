export interface IWhiteListEntity {
  id: string;
  vehicleId?: string;
  customerId?: string;
  reason: string;
  startDate: string;
  endDate?: string;
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
