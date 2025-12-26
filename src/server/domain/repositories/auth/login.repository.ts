import { ILoginParams, ILoginResponse } from "@/server/domain/index";
export abstract class LoginRepository {
    abstract login(params: ILoginParams): Promise<ILoginResponse>;
}