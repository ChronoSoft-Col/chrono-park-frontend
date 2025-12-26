import { ILoginParams, ILoginResponse, LoginRepository } from "@/src/server/domain";
import { AxiosServerInstance } from "../axios-server.intance";

import { injectable } from "tsyringe";

@injectable()
export class LoginDatasourceService
  extends AxiosServerInstance
  implements LoginRepository
{
  async login(params: ILoginParams): Promise<ILoginResponse> {
    return this.api.post<ILoginResponse>("/auth/login", params)
      .then((response) => response.data)
    ;
  }
}
