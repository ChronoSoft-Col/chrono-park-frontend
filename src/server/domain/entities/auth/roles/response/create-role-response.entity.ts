import IGeneralResponse from "@/src/shared/interfaces/generic/general-response.interface";
import { IRoleEntity } from "../role.entity";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ICreateRoleResponseEntity extends IGeneralResponse<IRoleEntity> {}
