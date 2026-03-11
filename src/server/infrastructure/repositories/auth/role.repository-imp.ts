import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { RoleDatasourceService } from "@/server/infrastructure/datasources/auth/role-datasource.service";
import {
    RoleRepository,
    ICreateRoleParamsEntity,
    ICreateRoleResponseEntity,
    IListRolesParamsEntity,
    IListRolesResponseEntity,
    IUpdateRoleParamsEntity,
    IGetRoleResponseEntity,
    IActionGroupEntity,
} from "@/server/domain";

@injectable()
export class RoleRepositoryImp implements RoleRepository {
    constructor(@inject(SERVER_TOKENS.RoleDatasourceService) private roleDatasourceService: RoleDatasourceService) {}

    listRoles(params: IListRolesParamsEntity): Promise<IListRolesResponseEntity> {
        return this.roleDatasourceService.listRoles(params);
    }

    getRoleById(roleId: string): Promise<IGetRoleResponseEntity> {
        return this.roleDatasourceService.getRoleById(roleId);
    }

    createRole(params: ICreateRoleParamsEntity): Promise<ICreateRoleResponseEntity> {
        return this.roleDatasourceService.createRole(params);
    }

    updateRole(roleId: string, params: IUpdateRoleParamsEntity): Promise<IGetRoleResponseEntity> {
        return this.roleDatasourceService.updateRole(roleId, params);
    }

    deleteRole(roleId: string): Promise<void> {
        return this.roleDatasourceService.deleteRole(roleId);
    }

    getAllActions(): Promise<IActionGroupEntity[]> {
        return this.roleDatasourceService.getAllActions();
    }

    replaceRoleActions(roleId: string, actionIds: string[]): Promise<void> {
        return this.roleDatasourceService.replaceRoleActions(roleId, actionIds);
    }
}
