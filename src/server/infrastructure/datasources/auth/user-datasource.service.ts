import { injectable } from "tsyringe";
import { AxiosServerInstance } from "../axios-server.intance";
import {
    IListUsersParamsEntity,
    IListUsersResponseEntity,
    ICreateUserParamsEntity,
    IUpdateUserParamsEntity,
    IGetUserResponseEntity,
    UserRepository,
} from "@/server/domain/index";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

@injectable()
export class UserDatasourceService extends AxiosServerInstance implements UserRepository {
    async listUsers(params: IListUsersParamsEntity): Promise<IListUsersResponseEntity> {
        return this.api
            .get<IListUsersResponseEntity>("/users", { params })
            .then(response => response.data);
    }

    async getUserById(userId: string): Promise<IGetUserResponseEntity> {
        return this.api
            .get<IGetUserResponseEntity>(`/users/${userId}`)
            .then(response => response.data);
    }

    async createUser(params: ICreateUserParamsEntity): Promise<IEmptyResponse> {
        return this.api
            .post<IEmptyResponse>("/users", params)
            .then(response => response.data);
    }

    async updateUser(userId: string, params: IUpdateUserParamsEntity): Promise<IGetUserResponseEntity> {
        return this.api
            .put<IGetUserResponseEntity>(`/users/${userId}`, params)
            .then(response => response.data);
    }

    async deleteUser(userId: string): Promise<void> {
        await this.api.delete(`/users/${userId}`);
    }
}
