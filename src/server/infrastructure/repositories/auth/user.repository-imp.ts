import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { UserDatasourceService } from "@/server/infrastructure/datasources/auth/user-datasource.service";
import {
    UserRepository,
    ICreateUserParamsEntity,
    IListUsersParamsEntity,
    IListUsersResponseEntity,
    IUpdateUserParamsEntity,
    IGetUserResponseEntity,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class UserRepositoryImp implements UserRepository {
    constructor(@inject(SERVER_TOKENS.UserDatasourceService) private userDatasourceService: UserDatasourceService) {}

    listUsers(params: IListUsersParamsEntity): Promise<IListUsersResponseEntity> {
        return this.userDatasourceService.listUsers(params);
    }

    getUserById(userId: string): Promise<IGetUserResponseEntity> {
        return this.userDatasourceService.getUserById(userId);
    }

    createUser(params: ICreateUserParamsEntity): Promise<IEmptyResponse> {
        return this.userDatasourceService.createUser(params);
    }

    updateUser(userId: string, params: IUpdateUserParamsEntity): Promise<IGetUserResponseEntity> {
        return this.userDatasourceService.updateUser(userId, params);
    }

    deleteUser(userId: string): Promise<void> {
        return this.userDatasourceService.deleteUser(userId);
    }
}
