
import { injectable, inject } from "tsyringe";

import { SERVER_TOKENS } from "@/server/di/server-tokens";
import { ILoginParams, ILoginResponse, LoginRepository } from "@/server/domain";

@injectable()
export class LoginUseCase{
    constructor(@inject(SERVER_TOKENS.LoginRepository) private loginRepository: LoginRepository){}

    async execute(params: ILoginParams): Promise<ILoginResponse>{
        return this.loginRepository.login(params);
    }
}