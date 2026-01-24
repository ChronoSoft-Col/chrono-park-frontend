import { InOutStatusEnum } from "@/src/shared/enums/parking/in-out-status.enum";
import { IPaginationParamsEntity } from "@/src/shared/interfaces/generic/pagination-params";

export interface IListInOutParamsEntity extends IPaginationParamsEntity {
    status: InOutStatusEnum;
    vehicleTypeId?: string;
}