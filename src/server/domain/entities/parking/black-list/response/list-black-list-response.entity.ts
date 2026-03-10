import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IBlackListEntity } from "../black-list.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListBlackListResponseEntity extends IGeneralResponse<IBlackListEntity, true> {}
