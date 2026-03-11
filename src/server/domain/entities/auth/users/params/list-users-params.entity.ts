import { IPaginationParamsEntity } from "@/src/shared/interfaces/generic/pagination-params";

export interface IListUsersParamsEntity extends IPaginationParamsEntity {
    roleId?: string;
}
