import {
    IListRolesParamsEntity,
    IListRolesResponseEntity,
    ICreateRoleParamsEntity,
    IUpdateRoleParamsEntity,
    IGetRoleResponseEntity,
    ICreateRoleResponseEntity,
    IActionGroupEntity,
} from "@/server/domain";

export abstract class RoleRepository {
    abstract listRoles(params: IListRolesParamsEntity): Promise<IListRolesResponseEntity>;
    abstract getRoleById(roleId: string): Promise<IGetRoleResponseEntity>;
    abstract createRole(params: ICreateRoleParamsEntity): Promise<ICreateRoleResponseEntity>;
    abstract updateRole(roleId: string, params: IUpdateRoleParamsEntity): Promise<IGetRoleResponseEntity>;
    abstract deleteRole(roleId: string): Promise<void>;
    abstract getAllActions(): Promise<IActionGroupEntity[]>;
    abstract replaceRoleActions(roleId: string, actionIds: string[]): Promise<void>;
}
