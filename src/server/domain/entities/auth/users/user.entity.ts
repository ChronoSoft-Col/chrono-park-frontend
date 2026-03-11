import IIdName from "@/src/shared/interfaces/generic/id-name.interface";

export interface IUserEntity {
    id: string;
    email: string;
    documentNumber: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    documentType: IIdName;
    role: IIdName;
}
