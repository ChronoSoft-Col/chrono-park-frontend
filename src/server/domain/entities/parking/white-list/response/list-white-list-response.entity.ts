import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IWhiteListEntity } from "../white-list.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IListWhiteListResponseEntity extends IGeneralResponse<IWhiteListEntity, true> {}
