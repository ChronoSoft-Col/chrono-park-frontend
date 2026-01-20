import IIdName from "@/src/shared/interfaces/generic/id-name.interface";

export interface ICustomerEntity {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    documentType: IIdName & {
        shortName: string;
    }
    documentNumber: string;
    email: string;
    phoneNumber: string;
    agreementId?: string;
    isActive: boolean;
    createdAt: Date;
    vehicles: ICustomerVehicleEntity[];
}

export interface ICustomerVehicleEntity {
    id: string;
    licensePlate: string;
    vehicleTypeId: string;
    vehicleTypeName: string;
    isActive: boolean;
}