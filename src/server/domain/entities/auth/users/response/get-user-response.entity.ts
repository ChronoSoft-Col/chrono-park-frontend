import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IUserEntity } from "../user.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetUserResponseEntity extends IGeneralResponse<IUserEntity> {}
