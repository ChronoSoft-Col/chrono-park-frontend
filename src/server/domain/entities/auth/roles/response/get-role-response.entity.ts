import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IRoleDetailEntity } from "../role.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGetRoleResponseEntity extends IGeneralResponse<IRoleDetailEntity> {}
