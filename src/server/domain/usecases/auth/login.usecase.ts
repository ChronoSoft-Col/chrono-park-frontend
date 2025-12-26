
import { injectable, inject } from "tsyringe";

import { ILoginParams, ILoginResponse, LoginRepository } from "@/server/domain/index";

@injectable()
export class LoginUseCase{
    constructor(@inject("LoginRepository") private loginRepository: LoginRepository){}

    async execute(params: ILoginParams): Promise<ILoginResponse>{
        return this.loginRepository.login(params);
    }
}