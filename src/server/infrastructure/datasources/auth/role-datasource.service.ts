import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import {
    IListRolesParamsEntity,
    IListRolesResponseEntity,
    ICreateRoleParamsEntity,
    ICreateRoleResponseEntity,
    IUpdateRoleParamsEntity,
    IGetRoleResponseEntity,
    IActionGroupEntity,
    RoleRepository,
} from "@/server/domain/index";

@injectable()
export class RoleDatasourceService extends AxiosServerInstance implements RoleRepository {
    async listRoles(params: IListRolesParamsEntity): Promise<IListRolesResponseEntity> {
        return this.api
            .get<IListRolesResponseEntity>("/roles", { params })
            .then(response => response.data);
    }

    async getRoleById(roleId: string): Promise<IGetRoleResponseEntity> {
        return this.api
            .get<IGetRoleResponseEntity>(`/roles/${roleId}`)
            .then(response => response.data);
    }

    async createRole(params: ICreateRoleParamsEntity): Promise<ICreateRoleResponseEntity> {
        return this.api
            .post<ICreateRoleResponseEntity>("/roles", params)
            .then(response => response.data);
    }

    async updateRole(roleId: string, params: IUpdateRoleParamsEntity): Promise<IGetRoleResponseEntity> {
        return this.api
            .put<IGetRoleResponseEntity>(`/roles/${roleId}`, params)
            .then(response => response.data);
    }

    async deleteRole(roleId: string): Promise<void> {
        await this.api.delete(`/roles/${roleId}`);
    }

    async getAllActions(): Promise<IActionGroupEntity[]> {
        return this.api
            .get<IActionGroupEntity[]>("/roles/actions")
            .then(response => response.data);
    }

    async replaceRoleActions(roleId: string, actionIds: string[]): Promise<void> {
        await this.api.put(`/roles/${roleId}/actions`, { actionIds });
    }
}
