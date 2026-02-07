export interface ICreateSubscriptionCustomerData {
  id?: string;
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

export interface ICreateSubscriptionVehicleData {
  id?: string;
  licensePlate: string;
  vehicleTypeId: string;
}

export interface ICreateSubscriptionParamsEntity {
  startDate: string;
  endDate: string;
  rateProfileId: string;
  customer: ICreateSubscriptionCustomerData;
  vehicle?: ICreateSubscriptionVehicleData;
}
