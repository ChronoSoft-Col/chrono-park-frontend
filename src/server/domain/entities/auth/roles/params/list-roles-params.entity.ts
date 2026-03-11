import { IPaginationParamsEntity } from "@/src/shared/interfaces/generic/pagination-params";

export interface IListRolesParamsEntity extends IPaginationParamsEntity {
    isActive?: boolean;
}
