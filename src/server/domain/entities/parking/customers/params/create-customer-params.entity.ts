import { ICustomerEntity, ICustomerVehicleEntity } from "./customer.entity";

export interface ICreateCustomerParamsEntity 
    extends Pick<ICustomerEntity, "documentNumber" | "firstName" | "lastName" | "agreementId" | "email" | "phoneNumber">
{

    documentTypeId: string;
    vehicles: ICreateVehicleForCustomerParamsEntity[];
}  

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateVehicleForCustomerParamsEntity extends Pick<ICustomerVehicleEntity, "licensePlate" | "vehicleTypeId"> {

}