import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
    IListRolesParamsEntity,
    IListRolesResponseEntity,
    ICreateRoleParamsEntity,
    IUpdateRoleParamsEntity,
    IGetRoleResponseEntity,
    ICreateRoleResponseEntity,
    IActionGroupEntity,
    RoleRepository,
} from "@/server/domain";

@injectable()
export class RoleUsecase implements RoleRepository {
    constructor(@inject(SERVER_TOKENS.RoleRepository) private readonly roleRepository: RoleRepository) {}

    listRoles(params: IListRolesParamsEntity): Promise<IListRolesResponseEntity> {
        return this.roleRepository.listRoles(params);
    }

    getRoleById(roleId: string): Promise<IGetRoleResponseEntity> {
        return this.roleRepository.getRoleById(roleId);
    }

    createRole(params: ICreateRoleParamsEntity): Promise<ICreateRoleResponseEntity> {
        return this.roleRepository.createRole(params);
    }

    updateRole(roleId: string, params: IUpdateRoleParamsEntity): Promise<IGetRoleResponseEntity> {
        return this.roleRepository.updateRole(roleId, params);
    }

    deleteRole(roleId: string): Promise<void> {
        return this.roleRepository.deleteRole(roleId);
    }

    getAllActions(): Promise<IActionGroupEntity[]> {
        return this.roleRepository.getAllActions();
    }

    replaceRoleActions(roleId: string, actionIds: string[]): Promise<void> {
        return this.roleRepository.replaceRoleActions(roleId, actionIds);
    }
}
