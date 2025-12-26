import { inject, injectable } from "tsyringe";

import { ILoginParams, ILoginResponse, LoginRepository } from "@/server/domain/index"

import { LoginDatasourceService } from "@/server/infrastructure/index"

@injectable()
export class LoginRepositoryImp implements LoginRepository {
    constructor(
        @inject("LoginDatasourceService") private loginDatasourceService: LoginDatasourceService
    ) {}

    async login(params: ILoginParams): Promise<ILoginResponse> {
        return this.loginDatasourceService.login(params);
    }
}