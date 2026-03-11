import {
    IListRolesParamsEntity,
    IListRolesResponseEntity,
    ICreateRoleParamsEntity,
    IUpdateRoleParamsEntity,
    IGetRoleResponseEntity,
    IActionGroupEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class RoleRepository {
    abstract listRoles(params: IListRolesParamsEntity): Promise<IListRolesResponseEntity>;
    abstract getRoleById(roleId: string): Promise<IGetRoleResponseEntity>;
    abstract createRole(params: ICreateRoleParamsEntity): Promise<IEmptyResponse>;
    abstract updateRole(roleId: string, params: IUpdateRoleParamsEntity): Promise<IGetRoleResponseEntity>;
    abstract deleteRole(roleId: string): Promise<void>;
    abstract getAllActions(): Promise<IActionGroupEntity[]>;
    abstract replaceRoleActions(roleId: string, actionIds: string[]): Promise<void>;
}
