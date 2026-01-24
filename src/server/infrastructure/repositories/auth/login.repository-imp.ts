import { inject, injectable } from "tsyringe";

import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { ILoginParams, ILoginResponse, LoginRepository } from "@/server/domain/index";

import { LoginDatasourceService } from "@/server/infrastructure/index"

@injectable()
export class LoginRepositoryImp implements LoginRepository {
    constructor(
        @inject(SERVER_TOKENS.LoginDatasourceService) private loginDatasourceService: LoginDatasourceService
    ) {}

    async login(params: ILoginParams): Promise<ILoginResponse> {
        return this.loginDatasourceService.login(params);
    }
}