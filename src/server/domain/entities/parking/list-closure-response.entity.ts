import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IClosureListItemEntity } from "./closure-list-item.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListClosureResponseEntity extends IGeneralResponse<IClosureListItemEntity, true> {
}
