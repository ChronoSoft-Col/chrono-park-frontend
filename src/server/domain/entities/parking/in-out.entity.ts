import IIdName from "@/src/shared/interfaces/generic/id-name.interface";

export interface IInOutEntity {
    id: string;
    vehicle: {
        licensePlate: string;
        id: string;
        vehicleType: IIdName;
    };
    rateProfile: IIdName;
    entryTime: string;
    exitTime?: string;
}