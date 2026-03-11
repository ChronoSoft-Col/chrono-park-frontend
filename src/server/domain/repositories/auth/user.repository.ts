import {
    IListUsersParamsEntity,
    IListUsersResponseEntity,
    ICreateUserParamsEntity,
    IUpdateUserParamsEntity,
    IGetUserResponseEntity,
} from "@/server/domain";
import IEmptyResponse from "@/src/shared/interfaces/generic/empty-response";

export abstract class UserRepository {
    abstract listUsers(params: IListUsersParamsEntity): Promise<IListUsersResponseEntity>;
    abstract getUserById(userId: string): Promise<IGetUserResponseEntity>;
    abstract createUser(params: ICreateUserParamsEntity): Promise<IEmptyResponse>;
    abstract updateUser(userId: string, params: IUpdateUserParamsEntity): Promise<IGetUserResponseEntity>;
    abstract deleteUser(userId: string): Promise<void>;
}
