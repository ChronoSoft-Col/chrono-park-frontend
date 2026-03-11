import { inject, injectable } from "tsyringe";
import { SERVER_TOKENS } from "@/server/di/server-tokens";
import {
    IListUsersParamsEntity,
    IListUsersResponseEntity,
    ICreateUserParamsEntity,
    IUpdateUserParamsEntity,
    IGetUserResponseEntity,
    UserRepository,
} from "@/server/domain";
import IEmptyResponse from "@/shared/interfaces/generic/empty-response";

@injectable()
export class UserUsecase implements UserRepository {
    constructor(@inject(SERVER_TOKENS.UserRepository) private readonly userRepository: UserRepository) {}

    listUsers(params: IListUsersParamsEntity): Promise<IListUsersResponseEntity> {
        return this.userRepository.listUsers(params);
    }

    getUserById(userId: string): Promise<IGetUserResponseEntity> {
        return this.userRepository.getUserById(userId);
    }

    createUser(params: ICreateUserParamsEntity): Promise<IEmptyResponse> {
        return this.userRepository.createUser(params);
    }

    updateUser(userId: string, params: IUpdateUserParamsEntity): Promise<IGetUserResponseEntity> {
        return this.userRepository.updateUser(userId, params);
    }

    deleteUser(userId: string): Promise<void> {
        return this.userRepository.deleteUser(userId);
    }
}
